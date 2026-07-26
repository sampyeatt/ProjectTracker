import Database from '@tauri-apps/plugin-sql'
import {BillableEntry, Project} from '@/utils/interfaces'

const dbUrl = 'sqlite:projecttracker.db'

/** Shape of a `times` row as SQLite returns it. */
interface ProjectRow {
    id: number
    client_name: string
    key: string
    total_time: number
    started_at: number
    running: number
    order_index: number
}

function toProject (row: ProjectRow): Project {
    return {
        id: row.id,
        clientName: row.client_name,
        key: row.key,
        running: row.running === 1,
        startedAt: row.started_at,
        totalTime: row.total_time,
        orderIndex: row.order_index
    }
}

/**
 * Data access for tracked projects.
 *
 * Every elapsed-time calculation happens in SQL rather than in JS so that the
 * banked total is derived from the row the database actually holds. The
 * `MAX(0, ...)` guards mean a backwards clock adjustment can never subtract
 * time from a project.
 */
export class TimeService {
    private db: Database | null = null

    /**
     * The database handle. `Database.get` is synchronous and defers connecting
     * until the first query, which is what the `preload` entry in
     * tauri.conf.json has already done for us.
     */
    private connection (): Database {
        this.db ??= Database.get(dbUrl)
        return this.db
    }

    /**
     * Every project, ordered for display.
     * @returns the tracked projects
     */
    public async getAllProjects (): Promise<Project[]> {
        const rows = await this.connection().select<ProjectRow[]>(
            'SELECT * FROM times ORDER BY order_index'
        )
        return rows.map(toProject)
    }

    /**
     * Create a project bound to a shortcut key.
     * @param clientName - name shown on the project button
     * @param key - shortcut key to bind, e.g. 'F9'
     * @param orderIndex - position in the grid
     */
    public async createProject (clientName: string, key: string, orderIndex: number): Promise<void> {
        await this.connection().execute(
            'INSERT INTO times (client_name, key, total_time, started_at, running, order_index) VALUES ($1, $2, 0, 0, 0, $3)',
            [clientName, key, orderIndex]
        )
    }

    /**
     * Make `id` the running project, banking the elapsed time of whichever
     * project was running before. A single statement so the two rows can never
     * disagree about which one holds the clock. Idempotent: switching to the
     * project that is already running leaves its start time alone.
     * @param id - project to start
     * @param now - epoch ms to treat as the switch point
     */
    public async switchTo (id: number, now: number): Promise<void> {
        await this.connection().execute(
            `UPDATE times
                SET total_time = CASE WHEN id = $1 THEN total_time ELSE total_time + MAX(0, $2 - started_at) END,
                    started_at = CASE WHEN id = $1 THEN (CASE WHEN running = 1 THEN started_at ELSE $2 END) ELSE 0 END,
                    running    = CASE WHEN id = $1 THEN 1 ELSE 0 END
              WHERE running = 1 OR id = $1`,
            [id, now]
        )
    }

    /**
     * Stop `id` and bank its elapsed time. A no-op if it wasn't running.
     * @param id - project to stop
     * @param now - epoch ms to treat as the stop point
     */
    public async stop (id: number, now: number): Promise<void> {
        await this.connection().execute(
            `UPDATE times
                SET total_time = total_time + MAX(0, $1 - started_at),
                    started_at = 0,
                    running    = 0
              WHERE id = $2 AND running = 1`,
            [now, id]
        )
    }

    /**
     * Stop every running project and bank the elapsed time.
     * @param now - epoch ms to treat as the stop point
     */
    public async stopAll (now: number): Promise<void> {
        await this.connection().execute(
            `UPDATE times
                SET total_time = total_time + MAX(0, $1 - started_at),
                    started_at = 0,
                    running    = 0
              WHERE running = 1`,
            [now]
        )
    }

    /**
     * Persist an edited project. `order_index` moves with the key so the grid
     * position and the shortcut stay in step.
     * @param project - the project with its new name, key and index
     */
    public async updateProject (project: Project): Promise<void> {
        await this.connection().execute(
            'UPDATE times SET client_name = $1, key = $2, order_index = $3 WHERE id = $4',
            [project.clientName, project.key, project.orderIndex, project.id]
        )
    }

    /**
     * Delete a project and its accrued time. History rows already written by
     * `recordEntries` are left alone.
     * @param id - project to delete
     */
    public async deleteProject (id: number): Promise<void> {
        await this.connection().execute('DELETE FROM times WHERE id = $1', [id])
    }

    /**
     * Append a day's billable totals to the history log. One multi-row INSERT so
     * the day is written atomically.
     * @param entries - the billable rows shown in the End Day dialog
     * @param endedAt - epoch ms the day was closed out
     */
    public async recordEntries (entries: BillableEntry[], endedAt: number): Promise<void> {
        if (entries.length === 0) return
        const placeholders = entries
            .map((_entry, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
            .join(', ')
        const values = entries.flatMap((entry) => [entry.clientName, entry.key, entry.hours, entry.totalTime, endedAt])
        await this.connection().execute(
            `INSERT INTO time_entries (client_name, key, hours, total_time, ended_at) VALUES ${placeholders}`,
            values
        )
    }

    /** Zero every project's clock. Only ever called after `recordEntries` has succeeded. */
    public async resetAll (): Promise<void> {
        await this.connection().execute('UPDATE times SET running = 0, started_at = 0, total_time = 0')
    }
}

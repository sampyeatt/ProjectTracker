import Database from '@tauri-apps/plugin-sql'
import { Time } from '../utils/interfaces.tsx'



export class TimeService {
    private db: Database | null = null

    /**
     * Constructor to initialize database connection
     */
    constructor () {
        this.initDB()
    }

    /**
     * Initialize database connection
     */
    private initDB () {
        this.db = Database.get('sqlite:projecttracker.db')
    }

    /**
     * Get all times from database for a given user
     * @param userId - user id number
     * @returns Time[] - array of time data
     */
    public async getAllTimes () {
        if (this.db) {
            return await this.db.select<Time[]>(
                `SELECT *, TRIM(key, 'F') as trim
                 FROM times
                 ORDER BY order_index`
            )
        }
        return []
    }

    /**
     * Reset all times for a given user. This will set the running flag to 0, the current time to 0 and the total time to 0.
     * @param userId - user id number
     */
    async resetAllTime () {
        if (this.db) {
            await this.db.execute('UPDATE times SET running = 0, current_time = 0, total_time = 0')
        }
    }

    /**
     * Create a new time entry in the database
     * @param clientName - name of the client
     * @param key - key pressed to start the time entry
     * @param index index for time
     * @returns QueryResult - result of the insert operation
     */
    async newTime (clientName: string, key: string, index: number) {
        if (this.db) {
            return await this.db.execute(
                'INSERT INTO times (client_name, key, total_time, order_index) VALUES ($1, $2, $3, $4)',
                [clientName, key, 0, index]
            )
        }
        return null
    }

    /**
     * Start a time entry for a given time id. This will set the current time to the current time and set the running flag to 1.
     * @param id - time id number
     * @param running - running flag. 1 for running, 0 for stopped
     * @param date - current time in milli
     * @returns QueryResult - result of the update operation
     */
    async startTime (id: number, running: number, date: number = Date.now()) {
        if (this.db) {
            return await this.db.execute('UPDATE times SET current_time = $1, running = $2 WHERE id = $3', [
                date,
                running,
                id
            ])
        }
        return null
    }

    /**
     * Stop a time entry for a given time id. This will set the current time to the current time and add the difference between the current time and the start time to the total time.
     * @param totalTime - total time spent on current project
     * @param timeId - time id number
     * @returns QueryResult - result of the update operation
     */
    async stopTime (totalTime: number = 0, timeId: number) {
        if (this.db) {
            return await this.db.execute(
                `UPDATE times SET running = 0, total_time =  $1 WHERE id = $2`,
                [totalTime, timeId]
            )
        }
        return null
    }

    /**
     * Reset all times for a given user. This will set the running flag to 0, the current time to 0 and the total time to 0.
     * @param userId - user id number
     * Delete a time entry for a given time id
     * @param id - time id number
     */
    async deleteTime (id: number) {
        if (this.db) {
            await this.db.execute('DELETE FROM times WHERE id = $1', [id])
        }
    }

    /**
     * update time
     * @param time time element
     */
    async updateTime (time: Time) {
        if (this.db) {
            await this.db.execute(`UPDATE times SET client_name = $1, key = $2, order_index = $3 WHERE id = $4`, [time.client_name, time.key, time.order_index, time.id])
        }
    }
}

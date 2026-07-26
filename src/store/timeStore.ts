import {create} from 'zustand'
import {BillableEntry, Project} from '@/utils/interfaces'
import {TimeService} from '@/services/times.service'
import {orderIndexForKey} from '@/utils/shared'

const timeService = new TimeService()

/**
 * Turn whatever the SQL layer threw into something worth putting in front of a
 * user. The UNIQUE violation is the one a user can actually cause, by binding
 * two projects to the same key.
 */
function describeError (error: unknown, fallback: string): string {
    const detail = error instanceof Error ? error.message : String(error)
    if (detail.includes('UNIQUE constraint failed: times.key')) {
        return 'That key is already bound to another project.'
    }
    return `${fallback}: ${detail}`
}

interface TimeState {
    /** Projects by shortcut key. Always mirrors the last successful DB read. */
    projects: Map<string, Project>
    /** True while a modal owns the keyboard, so shortcuts stand down. */
    dialogIsOpen: boolean
    /** Message for the toast, or null. */
    error: string | null
    loadProjects: () => Promise<void>
    startProject: (project: Project) => Promise<void>
    stopProject: (project: Project) => Promise<void>
    stopAll: () => Promise<void>
    createProject: (clientName: string, key: string) => Promise<boolean>
    updateProject: (project: Project) => Promise<void>
    deleteProject: (id: number) => Promise<void>
    endDay: (entries: BillableEntry[], endedAt: number) => Promise<void>
    setDialogOpen: (open: boolean) => void
    handleKey: (code: string) => void
    clearError: () => void
}

/** Shared by React StrictMode's double-invoked mount effect, so it only reads once. */
let inFlightLoad: Promise<void> | null = null

export const useTimeStore = create<TimeState>((set, get) => {
    /** Re-read every project from the database, the only writer of `projects`. */
    const refresh = async (): Promise<void> => {
        const projects = await timeService.getAllProjects()
        const next = new Map<string, Project>()
        projects.forEach((project) => next.set(project.key, project))
        set({projects: next})
    }

    /**
     * Run a write, then re-read. Any failure surfaces as a toast and leaves the
     * displayed state matching the database rather than an optimistic guess.
     */
    const mutate = async (fallback: string, write: () => Promise<void>): Promise<boolean> => {
        try {
            await write()
            await refresh()
            return true
        } catch (error) {
            set({error: describeError(error, fallback)})
            try {
                await refresh()
            } catch {
                // Already reporting the write failure; a failed re-read adds nothing.
            }
            return false
        }
    }

    return {
        projects: new Map<string, Project>(),
        dialogIsOpen: false,
        error: null,

        loadProjects: async () => {
            inFlightLoad ??= (async () => {
                try {
                    await refresh()
                } catch (error) {
                    set({error: describeError(error, 'Could not load projects')})
                } finally {
                    inFlightLoad = null
                }
            })()
            await inFlightLoad
        },

        startProject: async (project: Project) => {
            await mutate('Could not start the timer', async () => {
                await timeService.switchTo(project.id, Date.now())
            })
        },

        stopProject: async (project: Project) => {
            await mutate('Could not stop the timer', async () => {
                await timeService.stop(project.id, Date.now())
            })
        },

        stopAll: async () => {
            await mutate('Could not stop the timers', async () => {
                await timeService.stopAll(Date.now())
            })
        },

        createProject: async (clientName: string, key: string) => {
            return await mutate('Could not add the project', async () => {
                await timeService.createProject(clientName, key, orderIndexForKey(key))
            })
        },

        updateProject: async (project: Project) => {
            await mutate('Could not save the project', async () => {
                await timeService.updateProject({...project, orderIndex: orderIndexForKey(project.key)})
            })
        },

        deleteProject: async (id: number) => {
            await mutate('Could not delete the project', async () => {
                await timeService.deleteProject(id)
            })
        },

        endDay: async (entries: BillableEntry[], endedAt: number) => {
            // History first: if the reset then fails the day is still recorded,
            // which is the recoverable order of the two.
            await mutate('Could not close out the day', async () => {
                await timeService.recordEntries(entries, endedAt)
                await timeService.resetAll()
            })
        },

        setDialogOpen: (open: boolean) => set({dialogIsOpen: open}),

        handleKey: (code: string) => {
            const {dialogIsOpen, projects, startProject, stopProject} = get()
            if (dialogIsOpen) return
            const project = projects.get(code)
            if (!project) return
            void (project.running ? stopProject(project) : startProject(project))
        },

        clearError: () => set({error: null})
    }
})

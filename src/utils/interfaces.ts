/** A tracked project, as the UI sees it. Mapped from the snake_case/0-1 DB row by TimeService. */
export interface Project {
    id: number
    clientName: string
    key: string
    /** True while the clock is running for this project. */
    running: boolean
    /** Epoch ms the current run started; 0 when not running. */
    startedAt: number
    /** Milliseconds banked from completed runs. */
    totalTime: number
    orderIndex: number
}

/** One project's billable total for a single day, as written to `time_entries`. */
export interface BillableEntry {
    clientName: string
    key: string
    hours: number
    totalTime: number
}

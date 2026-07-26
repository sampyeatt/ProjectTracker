import {BillableEntry, Project} from '@/utils/interfaces'

export const msPerHour = 60 * 60 * 1000

/**
 * Unbilled allowance deducted from every project's daily total, covering the
 * few minutes of setup that aren't client work.
 */
export const gracePeriodMs = 5 * 60 * 1000

/** Billable time is rounded up to the next multiple of this many hours. */
export const roundingIncrementHours = 0.5

/**
 * Total milliseconds tracked against a project right now, including the run in
 * progress. Clamped at zero so a backwards clock adjustment can't subtract time.
 */
export function elapsedMs (project: Project, now: number): number {
    if (!project.running) return project.totalTime
    return project.totalTime + Math.max(0, now - project.startedAt)
}

/**
 * Convert tracked milliseconds into billable hours: drop the grace period, then
 * round up to the next increment. Returns 0 for anything inside the grace period.
 */
export function billableHours (totalMs: number): number {
    const billableMs = totalMs - gracePeriodMs
    if (billableMs <= 0) return 0
    const increments = Math.ceil(billableMs / msPerHour / roundingIncrementHours)
    return increments * roundingIncrementHours
}

/**
 * The day's billable entries, in display order, omitting projects that never got
 * past the grace period.
 */
export function billableEntries (projects: Iterable<Project>, now: number): BillableEntry[] {
    const entries: BillableEntry[] = []
    for (const project of projects) {
        const totalTime = elapsedMs(project, now)
        const hours = billableHours(totalTime)
        if (hours > 0) entries.push({clientName: project.clientName, key: project.key, hours, totalTime})
    }
    return entries.sort((a, b) => a.key.localeCompare(b.key, undefined, {numeric: true}))
}

/** Sum of an entry list's hours. Increments are exact halves, so this stays exact. */
export function totalHours (entries: BillableEntry[]): number {
    return entries.reduce((sum, entry) => sum + entry.hours, 0)
}

/** Hours rendered for display, always to two decimals. */
export function formatHours (hours: number): string {
    return hours.toFixed(2)
}

import {describe, expect, it} from 'vitest'
import {Project} from '@/utils/interfaces'
import {
    billableEntries,
    billableHours,
    elapsedMs,
    formatHours,
    gracePeriodMs,
    msPerHour,
    totalHours
} from '@/utils/billing'

const halfHour = msPerHour / 2

function project (overrides: Partial<Project> = {}): Project {
    return {
        id: 1,
        clientName: 'Acme',
        key: 'F9',
        running: false,
        startedAt: 0,
        totalTime: 0,
        orderIndex: 1,
        ...overrides
    }
}

describe('elapsedMs', () => {
    it('is the banked total when the project is stopped', () => {
        expect(elapsedMs(project({totalTime: 1000, startedAt: 500}), 9999)).toBe(1000)
    })

    it('adds the run in progress when the project is running', () => {
        const running = project({running: true, totalTime: 1000, startedAt: 5000})
        expect(elapsedMs(running, 8000)).toBe(4000)
    })

    it('never subtracts time when the clock has jumped backwards', () => {
        const running = project({running: true, totalTime: 1000, startedAt: 8000})
        expect(elapsedMs(running, 5000)).toBe(1000)
    })
})

describe('billableHours', () => {
    it('bills nothing inside the grace period', () => {
        expect(billableHours(0)).toBe(0)
        expect(billableHours(gracePeriodMs - 1)).toBe(0)
        expect(billableHours(gracePeriodMs)).toBe(0)
    })

    it('rounds the first billable millisecond up to a half hour', () => {
        expect(billableHours(gracePeriodMs + 1)).toBe(0.5)
    })

    it('rounds up to the next half hour', () => {
        expect(billableHours(gracePeriodMs + halfHour)).toBe(0.5)
        expect(billableHours(gracePeriodMs + halfHour + 1)).toBe(1)
        expect(billableHours(gracePeriodMs + 2 * msPerHour)).toBe(2)
        expect(billableHours(gracePeriodMs + 2 * msPerHour + 1)).toBe(2.5)
    })

    it('deducts the grace period once, not per hour', () => {
        expect(billableHours(gracePeriodMs + 8 * msPerHour)).toBe(8)
    })
})

describe('billableEntries', () => {
    const now = 1_000_000

    it('omits projects that never left the grace period', () => {
        const projects = [
            project({id: 1, key: 'F9', clientName: 'Acme', totalTime: gracePeriodMs + msPerHour}),
            project({id: 2, key: 'F10', clientName: 'Quiet', totalTime: gracePeriodMs - 1})
        ]
        expect(billableEntries(projects, now).map((e) => e.clientName)).toEqual(['Acme'])
    })

    it('includes the run in progress', () => {
        const projects = [
            project({running: true, startedAt: now - msPerHour, totalTime: gracePeriodMs})
        ]
        expect(billableEntries(projects, now)[0].hours).toBe(1)
    })

    it('orders keys numerically, so F9 precedes F10', () => {
        const projects = [
            project({id: 1, key: 'F10', totalTime: gracePeriodMs + msPerHour}),
            project({id: 2, key: 'F9', totalTime: gracePeriodMs + msPerHour})
        ]
        expect(billableEntries(projects, now).map((e) => e.key)).toEqual(['F9', 'F10'])
    })

    it('is empty when nothing was tracked', () => {
        expect(billableEntries([], now)).toEqual([])
    })
})

describe('totalHours', () => {
    it('sums half-hour increments without float drift', () => {
        const entries = Array.from({length: 10}, (_, i) => ({
            clientName: `c${i}`, key: `F${i + 9}`, hours: 0.5, totalTime: 0
        }))
        expect(totalHours(entries)).toBe(5)
        expect(formatHours(totalHours(entries))).toBe('5.00')
    })

    it('is zero for no entries', () => {
        expect(totalHours([])).toBe(0)
    })
})

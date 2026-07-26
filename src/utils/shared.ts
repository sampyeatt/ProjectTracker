/**
 * Function keys a project can be bound to, in display order. F9 is the first slot
 * because F1-F8 are too widely spoken for by other applications.
 */
export const projectKeys: readonly string[] = Array.from({length: 16}, (_, i) => `F${i + 9}`)

const projectKeySet = new Set(projectKeys)

/** True if `code` (a KeyboardEvent.code) is one of the project shortcut keys. */
export function isProjectKey (code: string): boolean {
    return projectKeySet.has(code)
}

/**
 * Position of `key` in the grid, 1-based. Returns 0 for keys that aren't
 * project keys, which the callers treat as "unordered".
 */
export function orderIndexForKey (key: string): number {
    return projectKeys.indexOf(key) + 1
}

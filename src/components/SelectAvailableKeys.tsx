import {useMemo} from 'react'
import {projectKeys} from '@/utils/shared'
import {Project} from '@/utils/interfaces'

/**
 * Picks a shortcut key from the ones not already bound. `keepKey` lets an edit
 * dialog keep offering the row's own current key.
 *
 * A native `<select>`: the platform renders the popup, so there is no list
 * virtualisation, no overlay positioning and no 69KB of Dropdown to ship.
 * @param projects - the bound projects, keyed by shortcut
 * @param value - the currently selected key, or '' for none
 * @param onChange - called with the newly selected key
 * @param keepKey - a taken key to keep offering, being this row's own
 * @param className - extra classes, applied after the defaults
 */
function SelectAvailableKeys ({projects, value, onChange, keepKey, className}: {
    projects: Map<string, Project>
    value: string
    onChange: (key: string) => void
    keepKey?: string
    className?: string
}) {
    const keyOptions = useMemo(
        () => projectKeys.filter((key) => !projects.has(key) || key === keepKey),
        [projects, keepKey]
    )

    return (
        <select value={value} onChange={(event) => onChange(event.target.value)}
            className={`rounded-lg border border-white/20 bg-[#0f0f0f] px-3 py-2 text-white ${className ?? ''}`}>
            <option value='' disabled>Select a key</option>
            {keyOptions.map((key) => <option key={key} value={key}>{key}</option>)}
        </select>
    )
}

export default SelectAvailableKeys

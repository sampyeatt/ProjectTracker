import {Dropdown} from 'primereact/dropdown'
import {projectKeys} from '@/utils/shared'
import {Project} from '@/utils/interfaces'
import {useMemo} from 'react'

/**
 * Picks a shortcut key from the ones not already bound. `keepKey` lets an edit
 * dialog keep offering the row's own current key.
 */
function SelectAvailableKeys ({projects, value, onChange, keepKey, className}: {
    projects: Map<string, Project>
    value: string
    onChange: (key: string) => void
    keepKey?: string
    className?: string
}) {
    const keyOptions = useMemo(
        () => projectKeys
            .filter((key) => !projects.has(key) || key === keepKey)
            .map((key) => ({label: key, value: key})),
        [projects, keepKey]
    )

    return (
        <Dropdown
            value={value}
            options={keyOptions}
            onChange={(e) => onChange(e.value)}
            placeholder='Select a key'
            className={className}
            scrollHeight='200px'
        />
    )
}

export default SelectAvailableKeys

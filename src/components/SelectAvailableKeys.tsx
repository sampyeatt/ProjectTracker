import {Dropdown} from 'primereact/dropdown'
import {availableKeys} from '@/utils/shared.tsx'
import {Time} from '@/utils/interfaces.tsx'
import {useMemo} from 'react'

function SelectAvailableKeys ({times, value, onChange, className}: {
    times: Map<string, Time>,
    value: string,
    onChange: (data: string) => void,
    className?: string
}) {
    const keyOptions = useMemo(() => {
        const options: Array<{ label: string, value: string }> = []
        availableKeys.forEach((_value, key) => {
            if (!times.has(key)) options.push({label: key, value: key})
        })
        return options
    }, [times])

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

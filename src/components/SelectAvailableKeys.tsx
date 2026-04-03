import {createListCollection, Select, Portal} from '@chakra-ui/react'
import {availableKeys} from '@/utils/shared.tsx'
import {Time} from '@/utils/interfaces.tsx'
import {JSX, useState} from 'react'

function SelectAvailableKeys ({times, hideLabel, onDataFromChild}: { times: Map<string, Time>, hideLabel: boolean, onDataFromChild: (data: string) => void }) {
    const keyOptions: Array<{ label: string, value: number }> = []
    const [renderKeyOptions, setKeyOptions] = useState<JSX.Element>()
    availableKeys.forEach((value, key) => {
        if (times.has(key)) return
        else keyOptions.push({
            label: key,
            value: value.id
        })
    })

    const keyOptionCollection = createListCollection({
        items: keyOptions
    })

    const renderKeys = () => {
        setKeyOptions(<Select.Content maxHeight={200}>
            {keyOptionCollection.items.map((keys) => (
                <Select.Item item={keys} key={keys.value}>
                    {keys.label}
                    <Select.ItemIndicator/>
                </Select.Item>
            ))}
        </Select.Content>)
    }

    const handleChildReturn = (e: string) => {
        setKeyOptions(undefined)
        onDataFromChild(e)
    }

    return (
        <Select.Root
            collection={keyOptionCollection}
            variant='outline'
            onValueChange={(e) => handleChildReturn(e.items[0].label)}>
            <Select.HiddenSelect/>
            <Select.Label hidden={hideLabel}>Select a key</Select.Label>
            <Select.Control>
                <Select.Trigger onClick={renderKeys}>
                    <Select.ValueText placeholder="Select a key"/>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator/>
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    {renderKeyOptions}
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}

export default SelectAvailableKeys
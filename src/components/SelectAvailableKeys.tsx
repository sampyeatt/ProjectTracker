import {createListCollection, Select, Portal} from '@chakra-ui/react'
import {availableKeys} from '@/utils/shared.tsx'
import {Time} from '@/utils/interfaces.tsx'
import {useMemo} from 'react'

function SelectAvailableKeys ({times, hideLabel, onDataFromChild}: { times: Map<string, Time>, hideLabel: boolean, onDataFromChild: (data: string) => void }) {
    const keyOptionCollection = useMemo(() => {
        const keyOptions: Array<{ label: string, value: number }> = []
        availableKeys.forEach((value, key) => {
            if (!times.has(key)) keyOptions.push({label: key, value: value.id})
        })
        return createListCollection({items: keyOptions})
    }, [times])

    return (
        <Select.Root
            collection={keyOptionCollection}
            variant='outline'
            onValueChange={(e) => onDataFromChild(e.items[0].label)}>
            <Select.HiddenSelect/>
            <Select.Label hidden={hideLabel}>Select a key</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select a key"/>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator/>
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content maxHeight={200}>
                        {keyOptionCollection.items.map((keys) => (
                            <Select.Item item={keys} key={keys.value}>
                                {keys.label}
                                <Select.ItemIndicator/>
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}

export default SelectAvailableKeys

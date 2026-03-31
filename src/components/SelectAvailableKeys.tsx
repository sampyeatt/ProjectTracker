import {createListCollection, Portal, Select} from '@chakra-ui/react'
import {availableKeys} from "@/utils/shared.tsx";

function SelectAvailableKeys({times}: { times: Map<string, number> }) {
    const keyOptions: Array<{ label: string, value: number }> = []
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

    return (
        <Select.Root collection={keyOptionCollection} variant='outline'>
            <Select.HiddenSelect/>
            <Select.Label>Select a key</Select.Label>
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
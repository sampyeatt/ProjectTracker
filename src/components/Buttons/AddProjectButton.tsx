import {Button, CloseButton, Dialog, Input, Portal, Stack} from '@chakra-ui/react'
import {RiAddLargeLine} from 'react-icons/ri'
import SelectAvailableKeys from "@/components/SelectAvailableKeys.tsx"
import { useState, useCallback} from "react"
import {availableKeys} from "@/utils/shared.tsx";
import {TimeService} from "@/services/times.service";

function AddProjectButton({times}: { times: Map<string, number> }) {
    const [clientName, setClientName] = useState('')
    const [selectedKey, setSelectedKey] = useState('')
    const [isSending, setIsSending] = useState(false);
    const timeService = new TimeService()

    const getSelectedKeyFromChild = useCallback((data: string) => {
        setSelectedKey(data)
    }, [])

    const addNewTime = () => {
        setIsSending(true)
        console.log('cl', clientName)
        console.log('k', selectedKey)
        const index = availableKeys.get(selectedKey)!.order_index
        timeService.newTime(clientName, selectedKey, index).then((res) => {
            console.log('res', res)
            if (res) {
                setIsSending(false)
            } if (res === null) {
                alert('Error adding time')
            }
        })
    }

    return (
        <div>
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <Button className='w-33! h-12!'>
                        <RiAddLargeLine/> Add Project
                    </Button>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop>
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    Add Project
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Stack gap={3}>
                                        <Input placeholder={'Client Name'} value={clientName} onChange={e => setClientName(e.target.value)}></Input>
                                        <SelectAvailableKeys times={times} onDataFromChild={getSelectedKeyFromChild}/>
                                    </Stack>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant='outline'>Cancel</Button>
                                    </Dialog.ActionTrigger>
                                    <Button onClick={addNewTime} disabled={isSending}>Save</Button>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size='sm'/>
                                </Dialog.CloseTrigger>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Dialog.Backdrop>
                </Portal>
            </Dialog.Root>

        </div>
    )
}

export default AddProjectButton
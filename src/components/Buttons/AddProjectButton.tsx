import {Button, CloseButton, Dialog, Input, Portal, Stack} from '@chakra-ui/react'
import {RiAddLargeLine} from 'react-icons/ri'
import SelectAvailableKeys from '@/components/SelectAvailableKeys.tsx'
import {useCallback, useState} from 'react'
import {availableKeys} from '@/utils/shared.tsx'
import {TimeService} from '@/services/times.service'
import {Time} from '@/utils/interfaces.tsx'

function AddProjectButton ({times, dialogSignal}: {
    times: Map<string, Time>,
    dialogSignal: (state: boolean) => void
}) {
    const [clientName, setClientName] = useState('')
    const [selectedKey, setSelectedKey] = useState('')

    const getSelectedKeyFromChild = useCallback((data: string) => {
        setSelectedKey(data)
    }, [])

    const addNewTime = () => {
        const timeService = new TimeService()
        const index = availableKeys.get(selectedKey)!.order_index
        timeService.newTime(clientName, selectedKey, index).then((res) => {
            if (res) {
                setClientName('')
                setSelectedKey('')
            }
            if (res === null) {
                setClientName('')
                setSelectedKey('')
                alert('Error adding time')
            }
        })
        dialogSignal(false)
    }

    return (
        <div className='flex justify-center p-2'>
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <Button className='w-33! h-12! bg-orange-900! hover:bg-orange-800! text-white!' onClick={() => dialogSignal(true)}>
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
                                        <Input placeholder={'Client Name'} value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}></Input>
                                        <SelectAvailableKeys times={times} hideLabel={false}
                                            onDataFromChild={getSelectedKeyFromChild}/>
                                    </Stack>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant='outline' onClick={() => dialogSignal(false)}>Cancel</Button>
                                    </Dialog.ActionTrigger>
                                    <Dialog.ActionTrigger asChild>
                                        <Button onClick={addNewTime}>Save</Button>
                                    </Dialog.ActionTrigger>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size='sm' onClick={() => dialogSignal(false)}/>
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
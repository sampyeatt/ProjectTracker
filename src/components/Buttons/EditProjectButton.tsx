import {Button, CloseButton, Dialog, Portal} from '@chakra-ui/react'
import {RiEditLine} from 'react-icons/ri'
import {JSX, useState} from "react"
import {Time} from "@/utils/interfaces.tsx";
import EditTable from "@/components/EditTable.tsx";

function EditProjectButton({times, updateTimeCB, deleteTimeCB, dialogSignal}: {
    times: Map<string, Time>,
    updateTimeCB: (data: Time) => void,
    deleteTimeCB: (id: number, key: string) => void,
    dialogSignal: (state: boolean) => void
}) {
    const [table, setTable] = useState<JSX.Element>()

    function handleOpenDialog() {
        dialogSignal(true)
        setTable(<EditTable times={times} updateTimeCB={updateTimeCB} deleteTimeCB={deleteTimeCB}/>)
    }

    return (
        <div className='flex justify-center p-2'>
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <Button className='w-33! h-12!' onClick={handleOpenDialog}>
                        <RiEditLine/> Edit Projects
                    </Button>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop>
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    Edit Projects
                                </Dialog.Header>
                                <Dialog.Body>
                                    {table}
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant='outline' onClick={() => dialogSignal(false)}>Done</Button>
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

export default EditProjectButton
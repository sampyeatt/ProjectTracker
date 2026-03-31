import {Button, CloseButton, Dialog, Input, Portal, Stack} from '@chakra-ui/react'
import {RiAddLargeLine} from 'react-icons/ri';
import SelectAvailableKeys from "@/components/SelectAvailableKeys.tsx";

function AddProjectButton({times}: { times: Map<string, number> }) {
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
                                        <Input placeholder={'Client Name'}></Input>
                                        <SelectAvailableKeys times={times} />
                                    </Stack>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant='outline'>Cancel</Button>
                                    </Dialog.ActionTrigger>
                                    <Button>Save</Button>
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
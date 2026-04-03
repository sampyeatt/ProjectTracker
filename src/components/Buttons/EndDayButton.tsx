import {Time} from "@/utils/interfaces.tsx";
import {Button, CloseButton, Dialog, Portal, Table} from "@chakra-ui/react";
import {RiEditLine} from "react-icons/ri";
import {JSX, useState} from "react";

function EndDayButton({times, onStopTime, dialogSignal,}: {
    times: Map<string, Time>,
    onStopTime: () => void,
    dialogSignal: (state: boolean) => void
}) {
    const [endTimesTable, setEndTimesTable] = useState<JSX.Element>()

    function handleOpenDialog() {
        dialogSignal(true)
        const tableRow: Array<JSX.Element> = []
        let endDayTotal = 0
        onStopTime()
        //TODO calculate updated times for EOD
        times.forEach((time) => {
            if (time.total_time - 300000 > 0) {
                const projectTime = +(Math.ceil(((time.total_time - 300000) / (1000 * 60 * 60)) * 2) / 2).toFixed(2)
                tableRow.push(
                    <Table.Row>
                        <Table.Cell>{time.client_name}</Table.Cell>
                        <Table.Cell>{projectTime}</Table.Cell>
                    </Table.Row>
                )
                endDayTotal += projectTime
            }
        })

        setEndTimesTable(
            <Table.Root variant={'outline'} size={'sm'}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Client</Table.ColumnHeader>
                        <Table.ColumnHeader>Total Hours</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tableRow}
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.Cell fontWeight={'bold'}>TOTAL</Table.Cell>
                        <Table.Cell fontWeight={'bold'}>{endDayTotal}</Table.Cell>
                    </Table.Row>
                </Table.Footer>
            </Table.Root>
        )
    }

    return (
        <div className='flex justify-center p-2'>
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <Button className='w-33! h-12!' onClick={handleOpenDialog}>
                        <RiEditLine/> End Day
                    </Button>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop>
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    End Day
                                </Dialog.Header>
                                <Dialog.Body>
                                    {endTimesTable}
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant='outline'>Cancel</Button>
                                    </Dialog.ActionTrigger>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant='outline'>Done</Button>
                                    </Dialog.ActionTrigger>
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

export default EndDayButton
import {Time} from '@/utils/interfaces.tsx'
import {IconButton, Input, Stack, Table} from '@chakra-ui/react'
import {JSX, useCallback, useMemo, useState} from 'react'
import {RiDeleteBinLine, RiEditLine, RiSave3Line} from 'react-icons/ri'
import {FcCancel} from 'react-icons/fc'
import SelectAvailableKeys from '@/components/SelectAvailableKeys.tsx'

function EditTable ({times, updateTimeCB, deleteTimeCB}: {
    times: Map<string, Time>,
    updateTimeCB: (data: Time) => void,
    deleteTimeCB: (id: number, key: string) => void
}) {
    const [editKey, setEditKey] = useState('')
    const [newClientName, setNewClientName] = useState('')
    const [selectedKey, setSelectedKey] = useState('')

    const getSelectedKeyFromChild = useCallback((data: string) => {
        setSelectedKey(data)
    }, [])

    const editLine = useCallback((key: string) => {
        setEditKey(key)
    }, [])

    const saveLineEdit = useCallback((key: string) => {
        const updatedTime = times.get(key)!
        if (newClientName !== '') {
            updatedTime.client_name = newClientName
            setNewClientName('')
        }
        if (selectedKey !== '') {
            updatedTime.key = selectedKey
            setSelectedKey('')
        }
        updateTimeCB(updatedTime)
        setEditKey('')
    }, [times, newClientName, selectedKey, updateTimeCB])

    const cancelLineEdit = useCallback(() => {
        setEditKey('')
        setNewClientName('')
    }, [])

    const deleteLine = useCallback((id: number, key: string) => {
        deleteTimeCB(id, key)
        setEditKey('')
    }, [deleteTimeCB])

    const projects: JSX.Element[] = useMemo(() => {
        const rows: JSX.Element[] = []
        times.forEach((time) => {
            if (editKey !== time.key) {
                rows.push(
                    <Table.Row key={time.key}>
                        <Table.Cell className={'w-35!'}>{time.client_name}</Table.Cell>
                        <Table.Cell className={'w-35!'}>{time.key}</Table.Cell>
                        <Table.Cell><IconButton onClick={() => editLine(time.key)}
                            disabled={editKey !== ''}><RiEditLine/></IconButton></Table.Cell>
                    </Table.Row>
                )
            } else {
                rows.push(
                    <Table.Row key={time.key}>
                        <Table.Cell className={'w-35!'}><Input value={newClientName} placeholder={time.client_name}
                            onChange={(e) => setNewClientName(e.target.value)}/></Table.Cell>
                        <Table.Cell className={'w-35!'}><SelectAvailableKeys times={times} hideLabel={true} onDataFromChild={getSelectedKeyFromChild}/>
                        </Table.Cell>
                        <Table.Cell>
                            <Stack direction={'row'}>
                                <IconButton onClick={() => saveLineEdit(time.key)}><RiSave3Line/></IconButton>
                                <IconButton onClick={cancelLineEdit}><FcCancel/></IconButton>
                                <IconButton onClick={() => deleteLine(time.id, time.key)}><RiDeleteBinLine/></IconButton>
                            </Stack>
                        </Table.Cell>
                    </Table.Row>
                )
            }
        })
        return rows
    }, [times, editKey, newClientName, editLine, saveLineEdit, cancelLineEdit, deleteLine, getSelectedKeyFromChild])

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Client</Table.ColumnHeader>
                    <Table.ColumnHeader>Key</Table.ColumnHeader>
                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {projects}
            </Table.Body>
        </Table.Root>
    )
}

export default EditTable

import {useState} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {InputText} from 'primereact/inputtext'
import {Time} from '@/utils/interfaces.tsx'
import SelectAvailableKeys from '@/components/SelectAvailableKeys.tsx'
import {useTimeStore} from '@/store/timeStore'

interface EditRowForm {
    clientName: string
    selectedKey: string
}

function EditTable () {
    const times = useTimeStore((s) => s.times)
    const updateTime = useTimeStore((s) => s.updateTime)
    const deleteTime = useTimeStore((s) => s.deleteTime)

    const [editKey, setEditKey] = useState('')
    const {control, handleSubmit, reset} = useForm<EditRowForm>({
        defaultValues: {clientName: '', selectedKey: ''}
    })

    const rows = Array.from(times.values())

    const startEdit = (time: Time) => {
        reset({clientName: time.client_name, selectedKey: ''})
        setEditKey(time.key)
    }

    const cancelEdit = () => {
        setEditKey('')
        reset({clientName: '', selectedKey: ''})
    }

    const saveEdit = (original: Time) => handleSubmit((data) => {
        const updated: Time = {...original}
        if (data.clientName !== '') updated.client_name = data.clientName
        if (data.selectedKey !== '') updated.key = data.selectedKey
        updateTime(updated)
        cancelEdit()
    })()

    const removeRow = (time: Time) => {
        deleteTime(time.id, time.key)
        cancelEdit()
    }

    const clientBody = (time: Time) => {
        if (editKey !== time.key) return <span>{time.client_name}</span>
        return (
            <Controller
                name='clientName'
                control={control}
                render={({field}) => <InputText {...field} placeholder={time.client_name} className='w-full'/>}
            />
        )
    }

    const keyBody = (time: Time) => {
        if (editKey !== time.key) return <span>{time.key}</span>
        return (
            <Controller
                name='selectedKey'
                control={control}
                render={({field}) => (
                    <SelectAvailableKeys times={times} value={field.value} onChange={field.onChange} className='w-full'/>
                )}
            />
        )
    }

    const actionBody = (time: Time) => {
        if (editKey !== time.key) {
            return (
                <Button icon='pi pi-pencil' title='Edit' className={'bg-purple-950! border-purple-950! hover:bg-purple-900!'}
                    disabled={editKey !== ''} onClick={() => startEdit(time)}/>
            )
        } else {
            return (
                <div className='flex flex-row gap-2'>
                    <Button icon='pi pi-check' title='Save' className={'bg-green-900! border-green-900! hover:bg-green-800!'} onClick={() => saveEdit(time)}/>
                    <Button icon='pi pi-times' title='Cancel' className={'bg-orange-600! border-orange-500! hover:bg-orange-600!'} onClick={cancelEdit}/>
                    <Button icon='pi pi-trash' title='Delete' className={'bg-red-900! border-red-900! hover:bg-red-800!'} onClick={() => removeRow(time)}/>
                </div>
            )
        }
    }

    // key={editKey} forces a remount when the edited row changes: PrimeReact's
    // DataTable deep-compares its props and won't re-run the body templates for
    // external state (editKey) alone, so without this the row never swaps into
    // its edit inputs.
    return (
        <DataTable key={editKey} value={rows} dataKey='key' size='small'>
            <Column header='Client' body={clientBody}/>
            <Column header='Key' body={keyBody}/>
            <Column header='Actions' body={actionBody}/>
        </DataTable>
    )
}

export default EditTable

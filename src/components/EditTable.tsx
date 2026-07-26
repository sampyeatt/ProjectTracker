import {useState} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {Button} from 'primereact/button'
import {InputText} from 'primereact/inputtext'
import {Project} from '@/utils/interfaces'
import SelectAvailableKeys from '@/components/SelectAvailableKeys'
import {useTimeStore} from '@/store/timeStore'

interface EditRowForm {
    clientName: string
    key: string
}

/**
 * Rename projects and rebind their shortcut keys.
 *
 * Deliberately plain markup rather than a DataTable: the table is at most 16
 * rows, and PrimeReact's deep prop comparison doesn't re-run body templates when
 * only external edit state changes, which previously needed a full remount to
 * work around.
 */
function EditTable () {
    const projects = useTimeStore((s) => s.projects)
    const updateProject = useTimeStore((s) => s.updateProject)
    const deleteProject = useTimeStore((s) => s.deleteProject)

    const [editingKey, setEditingKey] = useState<string | null>(null)
    const {control, handleSubmit, reset, formState: {errors}} = useForm<EditRowForm>({
        defaultValues: {clientName: '', key: ''}
    })

    const rows = Array.from(projects.values()).sort((a, b) => a.orderIndex - b.orderIndex)

    const startEdit = (project: Project) => {
        reset({clientName: project.clientName, key: project.key})
        setEditingKey(project.key)
    }

    const cancelEdit = () => {
        setEditingKey(null)
        reset({clientName: '', key: ''})
    }

    const saveEdit = (original: Project) => {
        void handleSubmit(async (data) => {
            await updateProject({...original, clientName: data.clientName, key: data.key})
            cancelEdit()
        })()
    }

    const removeRow = (project: Project) => {
        void deleteProject(project.id)
        cancelEdit()
    }

    if (rows.length === 0) {
        return <p className='text-center opacity-70'>No projects yet.</p>
    }

    return (
        <table className='w-full text-left'>
            <thead>
                <tr>
                    <th className='p-2'>Client</th>
                    <th className='p-2'>Key</th>
                    <th className='p-2'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((project) => {
                    const editing = editingKey === project.key
                    return (
                        <tr key={project.id} className='border-t border-white/10'>
                            <td className='p-2'>
                                {editing
                                    ? <Controller
                                        name='clientName'
                                        control={control}
                                        rules={{required: 'Client name is required'}}
                                        render={({field}) => (
                                            <InputText {...field} className={`w-full ${errors.clientName ? 'p-invalid' : ''}`}/>
                                        )}
                                    />
                                    : <span>{project.clientName}</span>}
                            </td>
                            <td className='p-2'>
                                {editing
                                    ? <Controller
                                        name='key'
                                        control={control}
                                        rules={{required: 'A key is required'}}
                                        render={({field}) => (
                                            <SelectAvailableKeys projects={projects} value={field.value}
                                                onChange={field.onChange} keepKey={project.key} className='w-full'/>
                                        )}
                                    />
                                    : <span>{project.key}</span>}
                            </td>
                            <td className='p-2'>
                                {editing
                                    ? (
                                        <div className='flex flex-row gap-2'>
                                            <Button icon='pi pi-check' title='Save'
                                                className='bg-green-900! border-green-900! hover:bg-green-800!'
                                                onClick={() => saveEdit(project)}/>
                                            <Button icon='pi pi-times' title='Cancel'
                                                className='bg-orange-600! border-orange-500! hover:bg-orange-600!'
                                                onClick={cancelEdit}/>
                                            <Button icon='pi pi-trash' title='Delete'
                                                className='bg-red-900! border-red-900! hover:bg-red-800!'
                                                onClick={() => removeRow(project)}/>
                                        </div>
                                    )
                                    : (
                                        <Button icon='pi pi-pencil' title='Edit'
                                            className='bg-purple-950! border-purple-950! hover:bg-purple-900!'
                                            disabled={editingKey !== null} onClick={() => startEdit(project)}/>
                                    )}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default EditTable

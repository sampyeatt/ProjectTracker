import {useState} from 'react'
import Button from '@/components/Button'
import {Project} from '@/utils/interfaces'
import SelectAvailableKeys from '@/components/SelectAvailableKeys'
import {useTimeStore} from '@/store/timeStore'

/** The row currently being edited, identified by the key it had on open. */
interface EditDraft {
    originalKey: string
    clientName: string
    key: string
}

/**
 * Rename projects and rebind their shortcut keys.
 *
 * Two fields with a required rule each is not enough to earn a form library, so
 * the draft is plain state. `invalid` only goes up on a save attempt, so a row
 * doesn't turn red the moment it's opened for editing.
 */
function EditTable () {
    const projects = useTimeStore((s) => s.projects)
    const updateProject = useTimeStore((s) => s.updateProject)
    const deleteProject = useTimeStore((s) => s.deleteProject)

    const [draft, setDraft] = useState<EditDraft | null>(null)
    const [invalid, setInvalid] = useState(false)

    const rows = Array.from(projects.values()).sort((a, b) => a.orderIndex - b.orderIndex)

    const startEdit = (project: Project) => {
        setDraft({originalKey: project.key, clientName: project.clientName, key: project.key})
        setInvalid(false)
    }

    const cancelEdit = () => {
        setDraft(null)
        setInvalid(false)
    }

    const saveEdit = (original: Project) => {
        if (draft === null) return
        const clientName = draft.clientName.trim()
        if (clientName === '' || draft.key === '') {
            setInvalid(true)
            return
        }
        void (async () => {
            await updateProject({...original, clientName, key: draft.key})
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
                    const editing = draft !== null && draft.originalKey === project.key
                    return (
                        <tr key={project.id} className='border-t border-white/10'>
                            <td className='p-2'>
                                {editing && draft !== null
                                    ? <input value={draft.clientName} aria-label='Client name'
                                        onChange={(event) => setDraft({...draft, clientName: event.target.value})}
                                        className={'w-full rounded-lg border bg-[#0f0f0f] px-3 py-2 text-white ' +
                                            (invalid && draft.clientName.trim() === '' ? 'border-red-500' : 'border-white/20')}/>
                                    : <span>{project.clientName}</span>}
                            </td>
                            <td className='p-2'>
                                {editing && draft !== null
                                    ? <SelectAvailableKeys projects={projects} value={draft.key}
                                        onChange={(key) => setDraft({...draft, key})}
                                        keepKey={project.key} className='w-full'/>
                                    : <span>{project.key}</span>}
                            </td>
                            <td className='p-2'>
                                {editing
                                    ? (
                                        <div className='flex flex-row gap-2'>
                                            <Button icon='check' iconOnly title='Save' aria-label='Save'
                                                className='border-green-900 bg-green-900 hover:bg-green-800'
                                                onClick={() => saveEdit(project)}/>
                                            <Button icon='times' iconOnly title='Cancel' aria-label='Cancel'
                                                className='border-orange-500 bg-orange-600 hover:bg-orange-500'
                                                onClick={cancelEdit}/>
                                            <Button icon='trash' iconOnly title='Delete' aria-label='Delete'
                                                className='border-red-900 bg-red-900 hover:bg-red-800'
                                                onClick={() => removeRow(project)}/>
                                        </div>
                                    )
                                    : (
                                        <Button icon='pencil' iconOnly title='Edit' aria-label='Edit'
                                            className='border-purple-950 bg-purple-950 hover:bg-purple-900'
                                            disabled={draft !== null} onClick={() => startEdit(project)}/>
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

import {useState} from 'react'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import SelectAvailableKeys from '@/components/SelectAvailableKeys'
import {useTimeStore} from '@/store/timeStore'

/** The fields being entered. Reset every time the dialog opens. */
interface AddProjectDraft {
    clientName: string
    selectedKey: string
}

const emptyDraft: AddProjectDraft = {clientName: '', selectedKey: ''}

function AddProjectButton () {
    const projects = useTimeStore((s) => s.projects)
    const createProject = useTimeStore((s) => s.createProject)
    const setDialogOpen = useTimeStore((s) => s.setDialogOpen)

    const [visible, setVisible] = useState(false)
    const [draft, setDraft] = useState<AddProjectDraft>(emptyDraft)
    const [invalid, setInvalid] = useState(false)

    const openDialog = () => {
        setDraft(emptyDraft)
        setInvalid(false)
        setVisible(true)
        setDialogOpen(true)
    }

    const closeDialog = () => {
        setVisible(false)
        setDialogOpen(false)
    }

    // On failure the store has already raised a toast; leave the dialog open so
    // the entered details aren't lost.
    const onSubmit = () => {
        const clientName = draft.clientName.trim()
        if (clientName === '' || draft.selectedKey === '') {
            setInvalid(true)
            return
        }
        void (async () => {
            if (await createProject(clientName, draft.selectedKey)) closeDialog()
        })()
    }

    const footer = (
        <div className='flex justify-end gap-2'>
            <Button label='Cancel' onClick={closeDialog}
                className='border-red-800 bg-transparent hover:bg-red-800/30'/>
            <Button label='Save' onClick={onSubmit}
                className='border-emerald-900 bg-emerald-900 hover:bg-emerald-800'/>
        </div>
    )

    return (
        <div className='flex justify-center p-2'>
            <Button label='Add Project' icon='plus' onClick={openDialog}
                className='h-12 w-33 border-orange-900 bg-orange-900 hover:bg-orange-800'/>
            <Modal header='Add Project' visible={visible} onHide={closeDialog} footer={footer} widthRem={25}>
                <div className='flex flex-col gap-3'>
                    <input value={draft.clientName} placeholder='Client Name' aria-label='Client name'
                        onChange={(event) => setDraft({...draft, clientName: event.target.value})}
                        className={'w-full rounded-lg border bg-[#0f0f0f] px-3 py-2 text-white ' +
                            (invalid && draft.clientName.trim() === '' ? 'border-red-500' : 'border-white/20')}/>
                    <SelectAvailableKeys projects={projects} value={draft.selectedKey}
                        onChange={(selectedKey) => setDraft({...draft, selectedKey})}
                        className={invalid && draft.selectedKey === '' ? 'border-red-500!' : ''}/>
                </div>
            </Modal>
        </div>
    )
}

export default AddProjectButton

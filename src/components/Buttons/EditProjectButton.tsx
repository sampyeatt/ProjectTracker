import {useState} from 'react'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import EditTable from '@/components/EditTable'
import {useTimeStore} from '@/store/timeStore'

function EditProjectButton () {
    const setDialogOpen = useTimeStore((s) => s.setDialogOpen)
    const [visible, setVisible] = useState(false)

    const openDialog = () => {
        setVisible(true)
        setDialogOpen(true)
    }

    const closeDialog = () => {
        setVisible(false)
        setDialogOpen(false)
    }

    const footer = (
        <div className='flex justify-end'>
            <Button label='Done' onClick={closeDialog}
                className='border-emerald-900 bg-transparent hover:bg-emerald-900/30'/>
        </div>
    )

    return (
        <div className='flex justify-center p-2'>
            <Button label='Edit Projects' icon='pencil' onClick={openDialog}
                className='h-12 w-33 border-sky-900 bg-sky-900 hover:bg-sky-800'/>
            <Modal header='Edit Projects' visible={visible} onHide={closeDialog} footer={footer} widthRem={32}>
                <EditTable/>
            </Modal>
        </div>
    )
}

export default EditProjectButton

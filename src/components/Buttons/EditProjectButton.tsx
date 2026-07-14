import {useState} from 'react'
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import EditTable from '@/components/EditTable.tsx'
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
            <Button label='Done' className={'bg-emerald-900!'} outlined onClick={closeDialog}/>
        </div>
    )

    return (
        <div className='flex justify-center p-2'>
            <Button label='Edit Projects' icon='pi pi-pencil'
                className='w-33! h-12! bg-sky-900! hover:bg-sky-800! border-sky-900! text-white!' onClick={openDialog}/>
            <Dialog header='Edit Projects' visible={visible} onHide={closeDialog}
                footer={footer} style={{width: '32rem'}}>
                {visible && <EditTable/>}
            </Dialog>
        </div>
    )
}

export default EditProjectButton

import {useState} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {InputText} from 'primereact/inputtext'
import SelectAvailableKeys from '@/components/SelectAvailableKeys'
import {useTimeStore} from '@/store/timeStore'

interface AddProjectForm {
    clientName: string
    selectedKey: string
}

function AddProjectButton () {
    const projects = useTimeStore((s) => s.projects)
    const createProject = useTimeStore((s) => s.createProject)
    const setDialogOpen = useTimeStore((s) => s.setDialogOpen)
    const [visible, setVisible] = useState(false)

    const {control, handleSubmit, reset, formState: {errors}} = useForm<AddProjectForm>({
        defaultValues: {clientName: '', selectedKey: ''}
    })

    const openDialog = () => {
        reset({clientName: '', selectedKey: ''})
        setVisible(true)
        setDialogOpen(true)
    }

    const closeDialog = () => {
        setVisible(false)
        setDialogOpen(false)
    }

    // On failure the store has already raised a toast; leave the dialog open so
    // the entered details aren't lost.
    const onSubmit = async (data: AddProjectForm) => {
        if (await createProject(data.clientName, data.selectedKey)) closeDialog()
    }

    const footer = (
        <div className='flex justify-end gap-2'>
            <Button label='Cancel' className={'bg-red-800!'} outlined onClick={closeDialog}/>
            <Button label='Save' className={'bg-emerald-900!'} onClick={() => void handleSubmit(onSubmit)()}/>
        </div>
    )

    return (
        <div className='flex justify-center p-2'>
            <Button label='Add Project' icon='pi pi-plus'
                className='w-33! h-12! bg-orange-900! hover:bg-orange-800! border-orange-900! text-white!' onClick={openDialog}/>
            <Dialog header='Add Project' visible={visible} onHide={closeDialog}
                footer={footer} style={{width: '25rem'}}>
                <div className='flex flex-col gap-3'>
                    <Controller
                        name='clientName'
                        control={control}
                        rules={{required: 'Client name is required'}}
                        render={({field}) => (
                            <InputText {...field} placeholder='Client Name'
                                className={errors.clientName ? 'p-invalid' : ''}/>
                        )}
                    />
                    <Controller
                        name='selectedKey'
                        control={control}
                        rules={{required: 'A key is required'}}
                        render={({field}) => (
                            <SelectAvailableKeys projects={projects} value={field.value}
                                onChange={field.onChange}
                                className={errors.selectedKey ? 'p-invalid' : ''}/>
                        )}
                    />
                </div>
            </Dialog>
        </div>
    )
}

export default AddProjectButton

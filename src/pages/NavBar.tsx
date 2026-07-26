import AddProjectButton from '@/components/Buttons/AddProjectButton'
import EditProjectButton from '@/components/Buttons/EditProjectButton'
import EndDayButton from '@/components/Buttons/EndDayButton'

function NavBar () {
    return (
        <div className='flex justify-center'>
            <div className='flex flex-row gap-2'>
                <AddProjectButton/>
                <EditProjectButton/>
                <EndDayButton/>
            </div>
        </div>
    )
}

export default NavBar

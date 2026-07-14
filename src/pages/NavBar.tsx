import AddProjectButton from '@/components/Buttons/AddProjectButton.tsx'
import EditProjectButton from '@/components/Buttons/EditProjectButton.tsx'
import EndDayButton from '@/components/Buttons/EndDayButton.tsx'

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

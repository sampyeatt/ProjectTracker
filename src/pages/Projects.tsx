import {JSX, useMemo} from 'react'
import ProjectButton from '../components/Buttons/ProjectButton.tsx'
import {availableKeys} from '@/utils/shared.tsx'
import {useTimeStore} from '@/store/timeStore'

function Projects () {
    const times = useTimeStore((s) => s.times)

    const projects: JSX.Element[] = useMemo(() => {
        const result: JSX.Element[] = []
        availableKeys.forEach((value) => {
            const displayTime = times.has(value.key) ? times.get(value.key)! : value
            result.push(
                <div key={displayTime.id}><ProjectButton project={displayTime}/></div>
            )
        })
        return result
    }, [times])

    return (
        <div className='flex justify-center p-2'>
            <div className='grid grid-cols-4 gap-2'>
                {projects}
            </div>
        </div>
    )
}

export default Projects

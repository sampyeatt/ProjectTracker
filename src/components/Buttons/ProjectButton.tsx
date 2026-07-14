import {Button} from 'primereact/button'
import {Time} from '@/utils/interfaces.tsx'
import {useTimeStore} from '@/store/timeStore'

function ProjectButton ({project}: { project: Time }) {
    const startTime = useTimeStore((s) => s.startTime)
    const stopTime = useTimeStore((s) => s.stopTime)

    const disabled = project.active === 0
    const running = project.running === 1

    const label = project.active
        ? `${project.client_name}\n${(project.total_time / (1000 * 60 * 60)).toFixed(2)} hours`
        : project.key

    const handleClick = () => {
        if (!project.running) startTime(project)
        else stopTime(project)
    }

    const stateClasses = running
        ? 'bg-purple-800! hover:bg-purple-700! border-purple-800!'
        : 'bg-purple-950! hover:bg-purple-900! border-purple-950!'

    return (
        <Button className={`w-33! h-16.5! ${stateClasses} whitespace-pre-line justify-center text-center`}
                outlined={!running} disabled={disabled} onClick={handleClick}>
            {label}
        </Button>
    )
}

export default ProjectButton

import {memo} from 'react'
import Button from '@/components/Button'
import {Project} from '@/utils/interfaces'
import {useTimeStore} from '@/store/timeStore'
import {elapsedMs, formatHours, msPerHour} from '@/utils/billing'

const baseClasses = 'h-16.5 w-33 justify-center whitespace-pre-line text-center text-sm leading-tight'

/**
 * One slot in the project grid. An unbound slot renders as a disabled button
 * showing the key it's waiting to be assigned.
 *
 * Memoised, and `now` is only passed through for the project that is actually
 * running (see Projects): the ticking clock then re-renders one button rather
 * than all sixteen.
 */
function ProjectButton ({shortcutKey, project, now}: {
    shortcutKey: string
    project?: Project
    now: number
}) {
    const startProject = useTimeStore((s) => s.startProject)
    const stopProject = useTimeStore((s) => s.stopProject)

    if (project === undefined) {
        return (
            <Button disabled className={`${baseClasses} border-purple-950 bg-transparent text-white/60`}>
                {shortcutKey}
            </Button>
        )
    }

    const running = project.running
    const hours = elapsedMs(project, now) / msPerHour
    const stateClasses = running
        ? 'bg-purple-800 hover:bg-purple-700 border-purple-800'
        : 'bg-purple-950 hover:bg-purple-900 border-purple-950'

    const handleClick = () => {
        void (running ? stopProject(project) : startProject(project))
    }

    return (
        <Button className={`${baseClasses} ${stateClasses}`} onClick={handleClick}>
            {`${project.clientName}\n${formatHours(hours)} hours`}
        </Button>
    )
}

export default memo(ProjectButton)

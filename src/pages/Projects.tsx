import ProjectButton from '@/components/Buttons/ProjectButton'
import {projectKeys} from '@/utils/shared'
import {useTimeStore} from '@/store/timeStore'
import {useNow} from '@/utils/useNow'

/**
 * Labels show hours to two decimals, so the text can only change once every 36
 * seconds. Ticking every five keeps the display within a few seconds of the
 * truth without paying for a render a second.
 */
const tickMs = 5000

function Projects () {
    const projects = useTimeStore((s) => s.projects)

    // Only tick while a timer is running; otherwise no label can change.
    const anyRunning = Array.from(projects.values()).some((project) => project.running)
    const now = useNow(anyRunning ? tickMs : null)

    return (
        <div className='flex justify-center p-2'>
            <div className='grid grid-cols-4 gap-2'>
                {projectKeys.map((key) => {
                    const project = projects.get(key)
                    // Only the running project's label depends on the clock. Feeding
                    // the others a constant keeps their memoised props unchanged, so
                    // a tick re-renders exactly one button.
                    return (
                        <ProjectButton key={key} shortcutKey={key} project={project}
                            now={project?.running === true ? now : 0}/>
                    )
                })}
            </div>
        </div>
    )
}

export default Projects

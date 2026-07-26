import ProjectButton from '@/components/Buttons/ProjectButton'
import {projectKeys} from '@/utils/shared'
import {useTimeStore} from '@/store/timeStore'
import {useNow} from '@/utils/useNow'

const tickMs = 1000

function Projects () {
    const projects = useTimeStore((s) => s.projects)

    // Only tick while a timer is running; otherwise no label can change.
    const anyRunning = Array.from(projects.values()).some((project) => project.running)
    const now = useNow(anyRunning ? tickMs : null)

    return (
        <div className='flex justify-center p-2'>
            <div className='grid grid-cols-4 gap-2'>
                {projectKeys.map((key) => (
                    <ProjectButton key={key} shortcutKey={key} project={projects.get(key)} now={now}/>
                ))}
            </div>
        </div>
    )
}

export default Projects

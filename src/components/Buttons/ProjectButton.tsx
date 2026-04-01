import {Button} from '@chakra-ui/react'
import {Time} from '@/utils/interfaces.tsx'
// import {TimeService} from "@/services/times.service.tsx";


function ProjectButton({project, onStartTime, onStopTime}: {project: Time, onStartTime: (data: Time) => void, onStopTime: (data: Time) => void}) {
    let varient: 'outline' | 'subtle' = 'outline'
    const dis = (project.active === 0)
    if (project.running === 1) varient = 'subtle'
    let buttonContent = <p>{project.key}</p>

    if (project.active) {
        buttonContent = <p>{project.client_name}<br/>{(project.total_time / (1000 * 60 * 60)).toFixed(2)} hours</p>
    }

    const handleClick = () => {
        console.log('clicked')

        // const timeService = new TimeService()
        if (!project.running) {
            onStartTime(project)
        } else if (project.running) {
            onStopTime(project)
        }
    }

    return (
        <Button asChild className='w-33! h-16.5!' disabled={dis} variant={varient} colorPalette={'purple'} onClick={handleClick}>
            {buttonContent}
        </Button>
    )
}

export default ProjectButton
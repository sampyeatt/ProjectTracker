import {Button} from '@chakra-ui/react'
import {Time} from '@/utils/interfaces.tsx';

function ProjectButton({project, totalTime}: {project: Time, totalTime: string}) {
    let varientName: 'outline' | 'solid' = 'outline'
    const dis = (project.active === 1)
    if (project.running) varientName = 'solid'
    let buttonContent = <p>{project.client_name}<br/>{totalTime} hours</p>

    if (!project.active) {
        buttonContent =<p>{project.key}</p>
    }

    return (
        <Button asChild className='w-33! h-16.5!' disabled={dis} variant={varientName}>
            {buttonContent}
        </Button>
    )
}

export default ProjectButton
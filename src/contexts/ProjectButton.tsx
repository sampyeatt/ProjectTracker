import {Button} from "@chakra-ui/react"
import {Time} from "@/utils/interfaces.tsx";

export default function ProjectButton({project, totalTime}: {project: Time, totalTime: string}) {
    let varientName: 'outline' | 'solid' = 'outline'
    let dis = false
    if (project.id < 0) dis = true
    if (project.running) varientName = 'solid'

    return (
        <Button asChild className="w-33! h-16.5!" disabled={dis} variant={varientName}>
            <p>{project.client_name}<br/>{totalTime} hours</p>
        </Button>
    )
}
import {SimpleGrid, Box} from '@chakra-ui/react'
import ProjectButton from '../components/Buttons/ProjectButton.tsx'
import {JSX} from 'react';
import {Time} from '@/utils/interfaces.tsx';
import {availableKeys} from "@/utils/shared.tsx";

function Projects({times}: { times: Map<string, Time> }) {

    const projects: JSX.Element[] = []
    availableKeys.forEach((value) => {
        let displayTime = value
        if (times.has(value.key)) displayTime = times.get(value.key)!
        projects.push(
            <Box key={displayTime.id}><ProjectButton project={displayTime} totalTime={(displayTime.total_time / (1000 * 60 * 60)).toFixed(2)}/></Box>
        )


    })
    return (
        <div className='flex justify-center p-2'>
            <SimpleGrid columns={4} gap={2}>
                {projects}
            </SimpleGrid>
        </div>
    )
}

export default Projects
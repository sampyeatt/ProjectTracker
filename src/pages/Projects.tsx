import {SimpleGrid, Box} from '@chakra-ui/react'
import ProjectButton from '../components/Buttons/ProjectButton.tsx'
import {JSX} from 'react'
import {Time} from '@/utils/interfaces.tsx'
import {availableKeys} from '@/utils/shared.tsx'

function Projects ({times, onStartTime, onStopTime}: { times: Map<string, Time>, onStartTime: (data: Time) => void, onStopTime: (data: Time) => void}) {
    const projects: JSX.Element[] = []
    availableKeys.forEach((value) => {
        let displayTime = value
        if (times.has(value.key)) displayTime = times.get(value.key)!
        projects.push(
            <Box key={displayTime.id}><ProjectButton project={displayTime} onStartTime={onStartTime} onStopTime={onStopTime}/></Box>
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
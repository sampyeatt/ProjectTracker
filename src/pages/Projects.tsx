import {SimpleGrid, Box} from '@chakra-ui/react'
import ProjectButton from '../components/Buttons/ProjectButton.tsx'
import {JSX, useMemo} from 'react'
import {Time} from '@/utils/interfaces.tsx'
import {availableKeys} from '@/utils/shared.tsx'

function Projects ({times, onStartTime, onStopTime}: { times: Map<string, Time>, onStartTime: (data: Time) => void, onStopTime: (data: Time) => void}) {
    const projects: JSX.Element[] = useMemo(() => {
        const result: JSX.Element[] = []
        availableKeys.forEach((value) => {
            const displayTime = times.has(value.key) ? times.get(value.key)! : value
            result.push(
                <Box key={displayTime.id}><ProjectButton project={displayTime} onStartTime={onStartTime} onStopTime={onStopTime}/></Box>
            )
        })
        return result
    }, [times, onStartTime, onStopTime])

    return (
        <div className='flex justify-center p-2'>
            <SimpleGrid columns={4} gap={2}>
                {projects}
            </SimpleGrid>
        </div>
    )
}

export default Projects

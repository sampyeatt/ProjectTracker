import {useState, useEffect, useCallback, JSX} from 'react'
import './App.css'
import {TimeService} from './services/times.service'
import {Time} from '@/utils/interfaces.tsx'
import AddProjectButton from '@/components/Buttons/AddProjectButton.tsx'
// import Projects from "@/pages/Projects.tsx";
import {availableKeys} from "@/utils/shared.tsx";
import {Box, Button, SimpleGrid} from "@chakra-ui/react";

const timeService = new TimeService()

function App() {
    const [times, setTimes] = useState(new Map())

    function getTimes () {
        try {
            const newMap = new Map(times)
            timeService.getAllTimes().then((timesFromDB) => {
                console.log('times from db:', timesFromDB)
                timesFromDB.forEach(time => {
                    newMap.set(time.key, time)
                })
                setTimes(newMap)
            })
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getTimes()
    }, [])

    const startTime = useCallback((data: Time) => {
        console.log('start time', times)
        const date = Date.now()
        timeService.startTime(data.id, 1, date).then((res) => {
            if (res) {
                const newData = data
                newData.running = 1
                newData.current_time = date
                console.log('times', newData)
                setTimes(times.set(data.key, newData))
            }
        })
    }, [])

    const stopTime = useCallback((data: Time) => {
        console.log('stop time', times)
        const date = Date.now()
        const updatedTime = data.total_time + (date - data.current_time)
        timeService.stopTime(updatedTime, data.id).then((res) => {
            if (res) {
                const newData = data
                newData.running = 0
                newData.total_time = updatedTime
                console.log('times', newData)
                setTimes(times.set(data.key, newData))
            }
        })
    }, [])

  return (
    <main className='container'>
        <AddProjectButton times={times}/>
        <Projects times={times} onStartTime={startTime} onStopTime={stopTime}/>
    </main>
  );
}

function Projects({times, onStartTime, onStopTime}: { times: Map<string, Time>, onStartTime: (data: Time) => void, onStopTime: (data: Time) => void}) {

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

function ProjectButton({project, onStartTime, onStopTime}: {project: Time, onStartTime: (data: Time) => void, onStopTime: (data: Time) => void}) {
    let varient: 'outline' | 'subtle' = 'outline'
    const dis = (project.active === 0)
    if (project.running === 1) varient = 'subtle'
    let buttonContent = <p>{project.key}</p>

    if (project.active) {
        buttonContent = <p>{project.client_name}<br/>{(project.total_time / (1000 * 60 * 60)).toFixed(2)} hours</p>
    }

    const handleClick = () => {
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

export default App;

import {useCallback, useState} from 'react'
import './App.css'
import {TimeService} from './services/times.service'
import {Time} from '@/utils/interfaces.tsx'
import AddProjectButton from '@/components/Buttons/AddProjectButton.tsx'
import Projects from "@/pages/Projects.tsx";

const timeService = new TimeService()

function getTimes() {
    const newMap = new Map<string, Time>()
    return timeService.getAllTimes().then((timesFromDB) => {
        timesFromDB.forEach(time => {
            newMap.set(time.key, time)
        })
        return newMap
    })
}

function App() {
    const [times, setTimes] = useState(new Map())
    getTimes().then((res) => {
        if (res) setTimes(res)
    })

    const startTime = useCallback((data: Time) => {
        console.log('start time', times)
        const date = Date.now()
        timeService.startTime(data.id, 1, date).then((res) => {
            if (res) {
                const newData = {...data}
                newData.running = 1
                newData.current_time = date
                setTimes(times.set(data.key, {...newData}))
            }
        })
    }, [])

    const stopTime = useCallback((data: Time) => {
        console.log('stop time', times)
        const date = Date.now()
        const updatedTime = data.total_time + (date - data.current_time)
        timeService.stopTime(updatedTime, data.id).then((res) => {
            if (res) {
                const newData = {...data}
                newData.running = 0
                newData.total_time = updatedTime
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

export default App;

import {useCallback, useState} from 'react'
import './App.css'
import {TimeService} from './services/times.service'
import {Time} from '@/utils/interfaces.tsx'
import Projects from "@/pages/Projects.tsx";
import {CloseButton, Stack} from "@chakra-ui/react";
import NavBar from "@/pages/NavBar.tsx";
import {getCurrentWindow} from "@tauri-apps/api/window";

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
        // Stop all currently running times
        times.forEach((value: Time) => {
            if (value.running === 1) {
                stopTime(value)
            }
        })
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

    const updateTime = useCallback((data: Time) => {
        console.log('Update time', data)
        timeService.updateTime(data).then(() => {
            setTimes(times.set(data.key, data))
        })
    }, [])

    const deleteTime = useCallback((id: number, key: string) => {
        timeService.deleteTime(id).then(() => {
            times.delete(key)
            setTimes(times)
        })
        console.log('delete time', key)
    }, [])

    const closeWindow = () => {
        console.log(getCurrentWindow())
        getCurrentWindow().close()
    }

    return (
        <main className='container'>
            <div className='flex place-content-start'>
                <CloseButton onClick={closeWindow} className={'w-13! h-13!'}/>
            </div>
            <Stack gap={'5'}>
                <NavBar times={times} updateTimeCB={updateTime} deleteTimeCB={deleteTime}/>
                <Projects times={times} onStartTime={startTime} onStopTime={stopTime}/>
            </Stack>
        </main>
    );
}

export default App;

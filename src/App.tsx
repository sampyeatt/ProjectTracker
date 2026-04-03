import React, {useCallback, useState} from 'react'
import './App.css'
import {TimeService} from './services/times.service'
import {Time} from '@/utils/interfaces.tsx'
import Projects from '@/pages/Projects.tsx'
import {CloseButton, Stack} from '@chakra-ui/react'
import NavBar from '@/pages/NavBar.tsx'
import {getCurrentWindow} from '@tauri-apps/api/window'

const timeService = new TimeService()

async function getTimes () {
    const newMap = new Map<string, Time>()
    const timesFromDB = await timeService.getAllTimes()
    timesFromDB.forEach((time) => {
        newMap.set(time.key, time)
    })
    return newMap
}

function App () {
    const [times, setTimes] = useState(new Map<string, Time>())
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
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

    const stopAllTimes = async () => {
        times.forEach((value: Time) => {
            if (value.running === 1) {
                stopTime(value)
            }
        })
        return await getTimes()
    }

    const updateTime = useCallback((data: Time) => {
        timeService.updateTime(data).then(() => {
            setTimes(times.set(data.key, data))
        })
    }, [])

    const deleteTime = useCallback((id: number, key: string) => {
        timeService.deleteTime(id).then(() => {
            times.delete(key)
            setTimes(times)
        })
    }, [])

    const closeWindow = () => {
        console.log(getCurrentWindow())
        getCurrentWindow().close()
    }

    const dialogSignal = (state: boolean) => {
        setDialogIsOpen(state)
    }

    const endDay = async () => {
        return await timeService.resetAllTime().then(() => {
            times.forEach((value: Time) => {
                times.set(value.key, {
                    ...value,
                    running: 0,
                    total_time: 0,
                    current_time: 0
                })
            })
            setTimes(times)
            dialogSignal(false)
            return times
        })
    }

    const handleKeyboardEvent = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (dialogIsOpen) return
        if (times.has(event.code)) {
            const time = times.get(event.code)
            if (!time) return
            if (time.running === 1) stopTime(time)
            else startTime(time)
        }
    }

    return (
        <main className='container' onKeyDown={handleKeyboardEvent} tabIndex={0}>
            <div className='flex place-content-start'>
                <CloseButton onClick={closeWindow} className={'w-13! h-13!'}/>
            </div>
            <Stack gap={'5'}>
                <NavBar times={times} updateTimeCB={updateTime} deleteTimeCB={deleteTime}
                    onStopTime={stopAllTimes} dialogSignal={dialogSignal} endDay={endDay}/>
                <Projects times={times} onStartTime={startTime} onStopTime={stopTime}/>
            </Stack>
        </main>
    )
}

export default App

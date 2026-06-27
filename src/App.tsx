import React, {useCallback, useEffect, useRef, useState} from 'react'
import './App.css'
import {TimeService} from './services/times.service'
import {Time} from '@/utils/interfaces.tsx'
import Projects from '@/pages/Projects.tsx'
import {CloseButton, Stack} from '@chakra-ui/react'
import NavBar from '@/pages/NavBar.tsx'
import {getCurrentWindow} from '@tauri-apps/api/window'

const timeService = new TimeService()

async function getTimes (): Promise<Map<string, Time>> {
    const newMap = new Map<string, Time>()
    const timesFromDB = await timeService.getAllTimes()
    timesFromDB.forEach((time) => newMap.set(time.key, time))
    return newMap
}

function App () {
    const [times, setTimes] = useState(new Map<string, Time>())
    const timesRef = useRef(times)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    useEffect(() => {
        getTimes().then((res) => {
            timesRef.current = res
            setTimes(res)
        })
    }, [])

    useEffect(() => {
        timesRef.current = times
    }, [times])

    const stopTime = useCallback((data: Time) => {
        const date = Date.now()
        const updatedTime = data.total_time + (date - data.current_time)
        timeService.stopTime(updatedTime, data.id).then((res) => {
            if (res) {
                setTimes(prev => new Map(prev).set(data.key, {...data, running: 0, total_time: updatedTime}))
            }
        })
    }, [])

    const startTime = useCallback((data: Time) => {
        const current = timesRef.current
        const date = Date.now()
        current.forEach((value: Time) => {
            if (value.running === 1) {
                timeService.stopTime(value.total_time + (date - value.current_time), value.id)
            }
        })
        timeService.startTime(data.id, 1, date).then((res) => {
            if (res) {
                setTimes(prev => {
                    const next = new Map(prev)
                    next.forEach((v, k) => {
                        if (v.running === 1) next.set(k, {...v, running: 0})
                    })
                    next.set(data.key, {...data, running: 1, current_time: date})
                    return next
                })
            }
        })
    }, [])

    const stopAllTimes = useCallback(async () => {
        const current = timesRef.current
        const date = Date.now()
        const stops: Promise<unknown>[] = []
        current.forEach((value: Time) => {
            if (value.running === 1) {
                stops.push(timeService.stopTime(value.total_time + (date - value.current_time), value.id))
            }
        })
        await Promise.all(stops)
        const fresh = await getTimes()
        timesRef.current = fresh
        setTimes(fresh)
        return fresh
    }, [])

    const updateTime = useCallback((data: Time) => {
        timeService.updateTime(data).then(() => {
            setTimes(prev => new Map(prev).set(data.key, data))
        })
    }, [])

    const deleteTime = useCallback((id: number, key: string) => {
        timeService.deleteTime(id).then(() => {
            setTimes(prev => {
                const next = new Map(prev)
                next.delete(key)
                return next
            })
        })
    }, [])

    const closeWindow = useCallback(() => {
        getCurrentWindow().close()
    }, [])

    const dialogSignal = useCallback((state: boolean) => {
        setDialogIsOpen(state)
    }, [])

    const endDay = useCallback(async () => {
        await timeService.resetAllTime()
        setTimes(prev => {
            const next = new Map<string, Time>()
            prev.forEach((value, key) => {
                next.set(key, {...value, running: 0, total_time: 0, current_time: 0})
            })
            return next
        })
        setDialogIsOpen(false)
    }, [])

    const handleKeyboardEvent = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (dialogIsOpen) return
        const time = timesRef.current.get(event.code)
        if (!time) return
        if (time.running === 1) stopTime(time)
        else startTime(time)
    }, [dialogIsOpen, startTime, stopTime])

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

import {create} from 'zustand'
import {Time} from '@/utils/interfaces.tsx'
import {TimeService} from '@/services/times.service'
import {availableKeys} from '@/utils/shared.tsx'

const timeService = new TimeService()

async function fetchTimes (): Promise<Map<string, Time>> {
    const newMap = new Map<string, Time>()
    const timesFromDB = await timeService.getAllTimes()
    timesFromDB.forEach((time) => newMap.set(time.key, time))
    return newMap
}

interface TimeState {
    times: Map<string, Time>
    dialogIsOpen: boolean
    loadTimes: () => Promise<void>
    startTime: (data: Time) => void
    stopTime: (data: Time) => void
    stopAllTimes: () => Promise<Map<string, Time>>
    updateTime: (data: Time) => void
    deleteTime: (id: number, key: string) => void
    newTime: (clientName: string, key: string) => Promise<boolean>
    endDay: () => Promise<void>
    setDialogOpen: (state: boolean) => void
    handleKey: (code: string) => void
    activeTime?: Time
}

export const useTimeStore = create<TimeState>((set, get) => ({
    times: new Map<string, Time>(),
    dialogIsOpen: false,

    loadTimes: async () => {
        const res = await fetchTimes()
        set({times: res})
        res.forEach(t => {
            if (t.running) {
                set({activeTime: t})
            }
        })
    },

    startTime: (data: Time) => {
        const date = Date.now()
        const value = get().activeTime
        if (value) {
            const inactiveTime = value.total_time + (date - value.current_time)
            timeService.stopTime(inactiveTime, value.id)
        }
        timeService.startTime(data.id, 1, date).then((res) => {
            if (res) {
                set((state) => {
                    const next = new Map(state.times)
                    next.set(data.key, {...data, running: 1, current_time: date})
                    if (value) {
                        const inactiveTime = value.total_time + (date - value.current_time)
                        next.set(value.key, {...value, running: 0, total_time: inactiveTime})
                    }
                    return {times: next}
                })
                set({activeTime: {...data, running: 1, current_time: date}})
            }
        })
    },

    stopTime: (data: Time) => {
        const date = Date.now()
        const updatedTime = data.total_time + (date - data.current_time)
        timeService.stopTime(updatedTime, data.id).then((res) => {
            if (res) {
                set((state) => ({
                    times: new Map(state.times).set(data.key, {...data, running: 0, total_time: updatedTime})
                }))
                set({activeTime: undefined})
            }
        })
    },

    stopAllTimes: async () => {
        const current = get().times
        const date = Date.now()
        const stops: Promise<unknown>[] = []
        current.forEach((value: Time) => {
            if (value.running === 1) {
                stops.push(timeService.stopTime(value.total_time + (date - value.current_time), value.id))
            }
        })
        await Promise.all(stops)
        const fresh = await fetchTimes()
        set({times: fresh})
        set({activeTime: undefined})
        return fresh
    },

    updateTime: (data: Time) => {
        timeService.updateTime(data).then(() => {
            set((state) => ({times: new Map(state.times).set(data.key, data)}))
            const activeTime = get().activeTime
            if (activeTime && activeTime.id === data.id) {
                set({activeTime: {...data}})
            }
        })
    },

    deleteTime: (id: number, key: string) => {
        timeService.deleteTime(id).then(() => {
            set((state) => {
                const next = new Map(state.times)
                next.delete(key)
                return {times: next}
            })
            const activeTime = get().activeTime
            if (activeTime && activeTime.id === id) {
                set({activeTime: undefined})
            }
        })
    },

    newTime: async (clientName: string, key: string) => {
        const index = availableKeys.get(key)!.order_index
        const res = await timeService.newTime(clientName, key, index)
        if (res) {
            await get().loadTimes()
            return true
        }
        return false
    },

    endDay: async () => {
        await timeService.resetAllTime()
        set((state) => {
            const next = new Map<string, Time>()
            state.times.forEach((value, key) => {
                next.set(key, {...value, running: 0, total_time: 0, current_time: 0})
            })
            return {times: next, dialogIsOpen: false}
        })
        const activeTime = get().activeTime
        if (activeTime) {
            set({activeTime: {...activeTime, running: 0, total_time: 0, current_time: 0}})
        }
    },

    setDialogOpen: (state: boolean) => set({dialogIsOpen: state}),

    handleKey: (code: string) => {
        const {dialogIsOpen, times, startTime, stopTime} = get()
        if (dialogIsOpen) return
        const time = times.get(code)
        if (!time) return
        if (time.running === 1) stopTime(time)
        else startTime(time)
    }
}))

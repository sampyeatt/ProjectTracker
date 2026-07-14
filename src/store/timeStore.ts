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
}

export const useTimeStore = create<TimeState>((set, get) => ({
    times: new Map<string, Time>(),
    dialogIsOpen: false,

    loadTimes: async () => {
        const res = await fetchTimes()
        set({times: res})
    },

    startTime: (data: Time) => {
        const current = get().times
        const date = Date.now()
        current.forEach((value: Time) => {
            if (value.running === 1) {
                timeService.stopTime(value.total_time + (date - value.current_time), value.id)
            }
        })
        timeService.startTime(data.id, 1, date).then((res) => {
            if (res) {
                set((state) => {
                    const next = new Map(state.times)
                    next.forEach((v, k) => {
                        if (v.running === 1) next.set(k, {...v, running: 0})
                    })
                    next.set(data.key, {...data, running: 1, current_time: date})
                    return {times: next}
                })
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
        return fresh
    },

    updateTime: (data: Time) => {
        timeService.updateTime(data).then(() => {
            set((state) => ({times: new Map(state.times).set(data.key, data)}))
        })
    },

    deleteTime: (id: number, key: string) => {
        timeService.deleteTime(id).then(() => {
            set((state) => {
                const next = new Map(state.times)
                next.delete(key)
                return {times: next}
            })
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

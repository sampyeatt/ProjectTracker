import {useEffect, useState} from 'react'

/**
 * Current epoch ms, re-rendering the caller every `intervalMs`. Pass null to
 * stop ticking — there's nothing running, so nothing on screen is changing.
 * @param intervalMs - tick period, or null to hold still
 * @returns epoch ms as of the last tick
 */
export function useNow (intervalMs: number | null): number {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        if (intervalMs === null) return undefined
        setNow(Date.now())
        const handle = setInterval(() => setNow(Date.now()), intervalMs)
        return () => clearInterval(handle)
    }, [intervalMs])

    return now
}

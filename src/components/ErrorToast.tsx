import {useEffect, useRef, useState} from 'react'
import Button from '@/components/Button'
import {useTimeStore} from '@/store/timeStore'

const lifetimeMs = 6000

/**
 * Surfaces store errors. Mounted once, at the app root.
 *
 * The store's `error` is a one-shot signal, cleared as soon as it has been
 * picked up, so the message lives here for as long as it is on screen. It is
 * held in a wrapper object so that the same message twice running still counts
 * as a new toast and restarts the timer.
 *
 * A popover rather than a plain fixed div, because the errors that matter most
 * are raised while a dialog is open — a duplicate key on Add Project, say. Modal
 * dialogs render in the top layer, where no z-index can reach them; a popover
 * joins the same layer, and being opened later it sits above the dialog.
 */
function ErrorToast () {
    const error = useTimeStore((s) => s.error)
    const clearError = useTimeStore((s) => s.clearError)
    const [toast, setToast] = useState<{text: string} | null>(null)
    const popover = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (error === null) return
        setToast({text: error})
        clearError()
    }, [error, clearError])

    useEffect(() => {
        const element = popover.current
        if (element === null) return undefined
        const open = element.matches(':popover-open')
        if (toast === null) {
            if (open) element.hidePopover()
            return undefined
        }
        if (!open) element.showPopover()
        const handle = setTimeout(() => setToast(null), lifetimeMs)
        return () => clearTimeout(handle)
    }, [toast])

    return (
        <div ref={popover} popover='manual' role='alert'
            className='m-0 inset-auto bottom-4 left-1/2 max-w-[90vw] -translate-x-1/2 items-center gap-3
                rounded-lg border border-red-700 bg-red-950 px-4 py-3 text-left text-sm text-[#f6f6f6] shadow-lg
                open:flex'>
            {toast !== null && (
                <>
                    <span>{toast.text}</span>
                    <Button icon='times' iconOnly aria-label='Dismiss' onClick={() => setToast(null)}
                        className='rounded-full border-transparent bg-transparent hover:bg-white/10'/>
                </>
            )}
        </div>
    )
}

export default ErrorToast

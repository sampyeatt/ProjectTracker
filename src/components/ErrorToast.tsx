import {useEffect, useRef} from 'react'
import {Toast} from 'primereact/toast'
import {useTimeStore} from '@/store/timeStore'

/** Surfaces store errors. Mounted once, at the app root. */
function ErrorToast () {
    const error = useTimeStore((s) => s.error)
    const clearError = useTimeStore((s) => s.clearError)
    const toast = useRef<Toast>(null)

    useEffect(() => {
        if (error === null) return
        toast.current?.show({severity: 'error', summary: 'Error', detail: error, life: 6000})
        clearError()
    }, [error, clearError])

    return <Toast ref={toast} position='bottom-center'/>
}

export default ErrorToast

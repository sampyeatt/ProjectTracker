import {useEffect} from 'react'
import './App.css'
import Projects from '@/pages/Projects'
import NavBar from '@/pages/NavBar'
import ErrorToast from '@/components/ErrorToast'
import {getCurrentWindow} from '@tauri-apps/api/window'
import Button from '@/components/Button'
import {useTimeStore} from '@/store/timeStore'
import {isProjectKey} from '@/utils/shared'

function App () {
    const loadProjects = useTimeStore((s) => s.loadProjects)
    const handleKey = useTimeStore((s) => s.handleKey)
    const stopAll = useTimeStore((s) => s.stopAll)

    useEffect(() => {
        void loadProjects()
    }, [loadProjects])

    // Listen on the window rather than a focused element: the shortcuts have to
    // keep working after a dialog closes and drops DOM focus back onto the body.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!isProjectKey(event.code)) return
            // F11 and F12 are fullscreen and devtools in the webview.
            event.preventDefault()
            handleKey(event.code)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [handleKey])

    // Bank the running timer before the window goes away, so closing can't leave
    // a row marked running with a start time from a previous session.
    useEffect(() => {
        const unlisten = getCurrentWindow().onCloseRequested(async (event) => {
            event.preventDefault()
            await stopAll()
            await getCurrentWindow().destroy()
        })
        return () => {
            void unlisten.then((off) => off())
        }
    }, [stopAll])

    const closeWindow = () => {
        void getCurrentWindow().close()
    }

    return (
        <main className='justify-center m-3'>
            <div className='flex place-content-start'>
                <Button icon='times' iconOnly aria-label='Close' onClick={closeWindow}
                    className='h-13 w-13 border-red-800 bg-red-800 text-xl hover:bg-red-700'/>
            </div>
            <div className='flex flex-col gap-5'>
                <NavBar/>
                <Projects/>
            </div>
            <ErrorToast/>
        </main>
    )
}

export default App

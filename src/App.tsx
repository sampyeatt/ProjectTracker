import React, {useEffect} from 'react'
import './App.css'
import Projects from '@/pages/Projects.tsx'
import NavBar from '@/pages/NavBar.tsx'
import {getCurrentWindow} from '@tauri-apps/api/window'
import {Button} from 'primereact/button'
import {useTimeStore} from '@/store/timeStore'

function App () {
    const loadTimes = useTimeStore((s) => s.loadTimes)
    const handleKey = useTimeStore((s) => s.handleKey)

    useEffect(() => {
        loadTimes()
    }, [loadTimes])

    const handleKeyboardEvent = (event: React.KeyboardEvent<HTMLDivElement>) => {
        handleKey(event.code)
    }

    const closeWindow = () => {
        getCurrentWindow().close()
    }

    return (
        <main className='container' onKeyDown={handleKeyboardEvent} tabIndex={0}>
            <div className='flex place-content-start'>
                <Button icon='pi pi-times' severity='danger' aria-label='Close'
                    className='w-13! h-13! bg-red-800! hover:bg-red-700! border-red-800!' onClick={closeWindow}/>
            </div>
            <div className='flex flex-col gap-5'>
                <NavBar/>
                <Projects/>
            </div>
        </main>
    )
}

export default App

import { useState, useEffect } from 'react';
// import { invoke } from '@tauri-apps/api/core';
import './App.css';
import Projects from './pages/Projects.tsx';
import {TimeService} from './services/times.service'
import {Time} from '@/utils/interfaces.tsx';
import AddProjectButton from '@/components/Buttons/AddProjectButton.tsx';

function App() {
    const [times, setTimes] = useState(new Map())


    const timeService = new TimeService()

    async function getTimes () {
        try {
            const newMap = new Map(times)
            const timesFromDB: Array<Time> = await timeService.getAllTimes()
            timesFromDB.forEach(time => {
                newMap.set(time.key, time)
            })
            setTimes(newMap)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getTimes()
    }, []
    )

  return (
    <main className='container'>
        <AddProjectButton times={times}/>
        <Projects times={times} />
    </main>
  );
}

export default App;

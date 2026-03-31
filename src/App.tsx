import { useState, useEffect } from "react";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Projects from "./pages/Projects.tsx";
import {TimeService} from "./services/times.service"
import {Time} from "@/utils/interfaces.tsx";
import AddProjectButton from "@/contexts/AddProjectButton.tsx";

function App() {
    const [times, setTimes] = useState<Time[]>([])
    const activeKeys = new Set<string>()
    const availableKeys = new Map<string, number>([
        ['F9', 1],
        ['F10', 2],
        ['F11', 3],
        ['F12', 4],
        ['F13', 5],
        ['F14', 6],
        ['F15', 7],
        ['F16', 8],
        ['F17', 9],
        ['F18', 10],
        ['F19', 11],
        ['F20', 12],
        ['F21', 13],
        ['F22', 14],
        ['F23', 15],
        ['F24', 16]
    ])

    const timeService = new TimeService()

    async function getTimes () {
        try {
            const times: Array<Time> = await timeService.getAllTimes()
            setTimes(times)
            times.forEach(time => {
                if(!activeKeys.has(time.key)) activeKeys.add(time.key)
            })
            constructBlankArray()
        } catch (error) {
            console.error(error)
        }
    }

    function constructBlankArray () {
        for (const [k, v] of availableKeys) {
            if (!activeKeys.has(k)) {
                times.push({
                    id: v * -1,
                    client_name: '',
                    key: k,
                    running: 0,
                    current_time: 0,
                    total_time: 0,
                    order_index: v
                })
            }
        }
        times.sort((a, b) => a.order_index - b.order_index)
    }

    useEffect(() => {
        getTimes()
    }, []
    )

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>
        <AddProjectButton />
        <Projects times={times} />
    </main>
  );
}

export default App;

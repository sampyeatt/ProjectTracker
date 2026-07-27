import {useState} from 'react'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import {useTimeStore} from '@/store/timeStore'
import {BillableEntry} from '@/utils/interfaces'
import {billableEntries, formatHours, totalHours} from '@/utils/billing'

/** The report shown in the dialog, frozen at the moment it was opened. */
interface DaySnapshot {
    entries: BillableEntry[]
    endedAt: number
}

function EndDayButton () {
    const projects = useTimeStore((s) => s.projects)
    const endDay = useTimeStore((s) => s.endDay)
    const setDialogOpen = useTimeStore((s) => s.setDialogOpen)

    const [snapshot, setSnapshot] = useState<DaySnapshot | null>(null)

    // Opening the dialog only reads: cancelling has to leave a running timer
    // running. The snapshot is frozen here so what gets recorded on Done is
    // exactly the report that was approved.
    const openDialog = () => {
        const endedAt = Date.now()
        setSnapshot({entries: billableEntries(projects.values(), endedAt), endedAt})
        setDialogOpen(true)
    }

    const closeDialog = () => {
        setSnapshot(null)
        setDialogOpen(false)
    }

    const handleDone = async () => {
        if (snapshot === null) return
        await endDay(snapshot.entries, snapshot.endedAt)
        closeDialog()
    }

    const entries = snapshot?.entries ?? []

    const footer = (
        <div className='flex justify-end gap-2'>
            <Button label='Cancel' onClick={closeDialog}
                className='border-red-800 bg-transparent hover:bg-red-800/30'/>
            <Button label='Done' onClick={() => void handleDone()}
                className='border-emerald-900 bg-emerald-900 hover:bg-emerald-800'/>
        </div>
    )

    return (
        <div className='flex justify-center p-2'>
            <Button label='End Day' icon='calendar' onClick={openDialog}
                className='h-12 w-33 border-emerald-900 bg-emerald-900 hover:bg-emerald-800'/>
            <Modal header='End Day' visible={snapshot !== null} onHide={closeDialog} footer={footer} widthRem={28}>
                {/* At most sixteen read-only rows, so a plain table. A DataTable
                    would have cost 316KB of JavaScript to render this. */}
                <table className='w-full text-left text-sm'>
                    <thead>
                        <tr className='border-b border-white/10'>
                            <th className='p-2'>Client</th>
                            <th className='p-2 text-right'>Total Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0
                            ? <tr><td colSpan={2} className='p-4 text-center opacity-70'>Nothing billable today.</td></tr>
                            : entries.map((entry) => (
                                <tr key={entry.key} className='border-b border-white/10'>
                                    <td className='p-2'>{entry.clientName}</td>
                                    <td className='p-2 text-right'>{formatHours(entry.hours)}</td>
                                </tr>
                            ))}
                    </tbody>
                    <tfoot>
                        <tr className='font-bold'>
                            <td className='p-2'>TOTAL</td>
                            <td className='p-2 text-right'>{formatHours(totalHours(entries))}</td>
                        </tr>
                    </tfoot>
                </table>
            </Modal>
        </div>
    )
}

export default EndDayButton

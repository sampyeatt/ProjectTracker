import {useState} from 'react'
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {ColumnGroup} from 'primereact/columngroup'
import {Row} from 'primereact/row'
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

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer='TOTAL' footerStyle={{fontWeight: 'bold'}}/>
                <Column footer={formatHours(totalHours(snapshot?.entries ?? []))} footerStyle={{fontWeight: 'bold'}}/>
            </Row>
        </ColumnGroup>
    )

    const footer = (
        <div className='flex justify-end gap-2'>
            <Button label='Cancel' className={'bg-red-800!'} outlined onClick={closeDialog}/>
            <Button label='Done' className={'bg-emerald-900!'} onClick={() => void handleDone()}/>
        </div>
    )

    return (
        <div className='flex justify-center p-2'>
            <Button label='End Day' icon='pi pi-calendar'
                className='w-33! h-12! bg-emerald-900! hover:bg-emerald-800! border-emerald-900! text-white!' onClick={openDialog}/>
            <Dialog header='End Day' visible={snapshot !== null} onHide={closeDialog}
                footer={footer} style={{width: '28rem'}}>
                <DataTable value={snapshot?.entries ?? []} size='small' footerColumnGroup={footerGroup}
                    emptyMessage='Nothing billable today.'>
                    <Column field='clientName' header='Client'/>
                    <Column header='Total Hours' body={(entry: BillableEntry) => formatHours(entry.hours)}/>
                </DataTable>
            </Dialog>
        </div>
    )
}

export default EndDayButton

import {useState} from 'react'
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {ColumnGroup} from 'primereact/columngroup'
import {Row} from 'primereact/row'
import {useTimeStore} from '@/store/timeStore'

interface EndDayRow {
    client_name: string
    hours: number
}

function EndDayButton () {
    const stopAllTimes = useTimeStore((s) => s.stopAllTimes)
    const endDay = useTimeStore((s) => s.endDay)
    const setDialogOpen = useTimeStore((s) => s.setDialogOpen)

    const [visible, setVisible] = useState(false)
    const [rows, setRows] = useState<EndDayRow[]>([])
    const [total, setTotal] = useState(0)

    const openDialog = async () => {
        setVisible(true)
        setDialogOpen(true)
        const times = await stopAllTimes()
        const tableRows: EndDayRow[] = []
        let endDayTotal = 0
        times.forEach((time) => {
            if (time.total_time - 300000 > 0) {
                const projectTime = +(Math.ceil(((time.total_time - 300000) / (1000 * 60 * 60)) * 2) / 2).toFixed(2)
                tableRows.push({client_name: time.client_name, hours: projectTime})
                endDayTotal += projectTime
            }
        })
        setRows(tableRows)
        setTotal(endDayTotal)
    }

    const closeDialog = () => {
        setVisible(false)
        setDialogOpen(false)
    }

    const handleDone = async () => {
        await endDay()
        closeDialog()
    }

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer='TOTAL' footerStyle={{fontWeight: 'bold'}}/>
                <Column footer={String(total)} footerStyle={{fontWeight: 'bold'}}/>
            </Row>
        </ColumnGroup>
    )

    const footer = (
        <div className='flex justify-end gap-2'>
            <Button label='Cancel' className={'bg-red-800!'} outlined onClick={closeDialog}/>
            <Button label='Done' className={'bg-emerald-900!'} onClick={handleDone}/>
        </div>
    )

    return (
        <div className='flex justify-center p-2'>
            <Button label='End Day' icon='pi pi-calendar'
                className='w-33! h-12! bg-emerald-900! hover:bg-emerald-800! border-emerald-900! text-white!' onClick={openDialog}/>
            <Dialog header='End Day' visible={visible} onHide={closeDialog}
                footer={footer} style={{width: '28rem'}}>
                <DataTable value={rows} size='small' footerColumnGroup={footerGroup}>
                    <Column field='client_name' header='Client'/>
                    <Column field='hours' header='Total Hours'/>
                </DataTable>
            </Dialog>
        </div>
    )
}

export default EndDayButton

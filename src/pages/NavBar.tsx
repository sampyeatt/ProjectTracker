import AddProjectButton from "@/components/Buttons/AddProjectButton.tsx";
import {Time} from "@/utils/interfaces.tsx";
import {Stack} from "@chakra-ui/react";
import EditProjectButton from "@/components/Buttons/EditProjectButton.tsx";
import EndDayButton from "@/components/Buttons/EndDayButton.tsx";

function NavBar({times, updateTimeCB, deleteTimeCB, onStopTime, dialogSignal}: {
    times: Map<string, Time>,
    updateTimeCB: (data: Time) => void,
    deleteTimeCB: (id: number, key: string) => void,
    onStopTime: () => void,
    dialogSignal: (state: boolean) => void
}) {
    return (
        <div className='flex justify-center'>
            <Stack direction='row'>
                <AddProjectButton times={times} dialogSignal={dialogSignal}/>
                <EditProjectButton times={times} updateTimeCB={updateTimeCB} deleteTimeCB={deleteTimeCB} dialogSignal={dialogSignal} />
                <EndDayButton times={times} onStopTime={onStopTime} dialogSignal={dialogSignal} />
            </Stack>
        </div>
    )
}

export default NavBar
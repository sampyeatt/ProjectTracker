import AddProjectButton from "@/components/Buttons/AddProjectButton.tsx";
import {Time} from "@/utils/interfaces.tsx";
import {Stack} from "@chakra-ui/react";
import EditProjectButton from "@/components/Buttons/EditProjectButton.tsx";
import EndDayButton from "@/components/Buttons/EndDayButton.tsx";

function NavBar({times, updateTimeCB, deleteTimeCB, onStopTime}: {
    times: Map<string, Time>,
    updateTimeCB: (data: Time) => void,
    deleteTimeCB: (id: number, key: string) => void,
    onStopTime: () => void
}) {
    return (
        <div className='flex justify-center'>
            <Stack direction='row'>
                <AddProjectButton times={times}/>
                <EditProjectButton times={times} updateTimeCB={updateTimeCB} deleteTimeCB={deleteTimeCB}/>
                <EndDayButton times={times}  onStopTime={onStopTime}/>
            </Stack>
        </div>
    )
}

export default NavBar
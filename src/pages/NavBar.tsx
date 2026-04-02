import AddProjectButton from "@/components/Buttons/AddProjectButton.tsx";
import {Time} from "@/utils/interfaces.tsx";
import {Stack} from "@chakra-ui/react";
import EditProjectButton from "@/components/Buttons/EditProjectButton.tsx";

function NavBar({times, updateTimeCB, deleteTimeCB}: {
    times: Map<string, Time>,
    updateTimeCB: (data: Time) => void,
    deleteTimeCB: (id: number, key: string) => void
}) {
    return (
        <div className='flex justify-center'>
            <Stack direction='row'>
                <AddProjectButton times={times}/>
                <EditProjectButton times={times} updateTimeCB={updateTimeCB} deleteTimeCB={deleteTimeCB}/>
            </Stack>
        </div>
    )
}

export default NavBar
import {SimpleGrid, Box} from "@chakra-ui/react"
import ProjectButton from "../contexts/ProjectButton.tsx"
import {JSX} from "react";
import {Time} from "@/utils/interfaces.tsx";

function Projects({times}: { times: Array<Time> }) {

    const projects: JSX.Element[] = []
    times.forEach((value) => {
        projects.push(
            <Box><ProjectButton project={value} totalTime={(value.total_time / (1000 * 60 * 60)).toFixed(2)}/></Box>
        )
    })
    return (
        <div className="flex justify-center p-2">
            <SimpleGrid columns={4} gap={2}>
                {projects}
            </SimpleGrid>
        </div>
    )
}

export default Projects
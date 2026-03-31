import {Button} from "@chakra-ui/react"
import {RiAddLargeLine} from "react-icons/ri";

function AddProjectButton() {
    return (
        <div>
            <Button className="w-33! h-12!">
                <RiAddLargeLine /> Add Project
            </Button>
        </div>
    )
}

export default AddProjectButton
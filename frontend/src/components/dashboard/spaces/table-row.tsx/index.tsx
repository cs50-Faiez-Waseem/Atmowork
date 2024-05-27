
import {
    Tooltip, Avatar,
    Tr,
    Td,
    Link,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    IconButton,
    AvatarGroup,
} from '@chakra-ui/react'
import { AiOutlinePlus, AiFillDelete } from 'react-icons/ai'
import { GoKebabHorizontal } from 'react-icons/go'

import { CiEdit } from 'react-icons/ci'
import { useRouter } from 'next/router'
import { projectType } from '@/types/types'

interface SpacesTrProps {
    project : projectType,
    deleteProject : (id : string) => void
}


export default function SpacesTr({ project, deleteProject } : SpacesTrProps) {

    const router = useRouter()

    return <Tr key={project._id} >
        <Td> <Link href={`/dashboard/kanban/${project._id}`} onClick={(e) => {
            e.preventDefault();
            router.push(`/dashboard/kanban/${project._id}`)
        }} > {project.title} </Link></Td>
        <Td onClick={() => console.log(project)}>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'nill'}</Td>
        <Td>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'nill'}</Td>
        <Td>{project.creatorid.username}</Td>
        <Td>
            <AvatarGroup size='md' max={2}>
                {project.members.map(member => <Avatar name={member.username} key={member.username} size='sm' src='https://bit.ly/dan-a'  />)}
            </AvatarGroup>
        </Td>
        <Td>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<GoKebabHorizontal />}
                    variant='outline'
                />
                <MenuList>
                    <MenuItem icon={<CiEdit />}>
                        Edit
                    </MenuItem>
                    <MenuItem icon={<AiFillDelete />} color={'red'} onClick={() => deleteProject(project._id)} >
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
        </Td>
    </Tr>
}
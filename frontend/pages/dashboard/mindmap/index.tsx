import { useEffect, useState } from 'react'
import { Stack, Flex, useToast } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure
} from '@chakra-ui/react'
import SideBar from '@/components/dashboard/sidebar/index'
import useUser from '@/providers/userStore'
import api from '@/utils/fetcher'
import { MindMapType } from '@/types/types'
import Link from 'next/link'
import {
    Box,
    Center,
    useColorModeValue,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Image,
} from '@chakra-ui/react'
import initialdata from './initialdata'

import { GoKebabHorizontal } from "react-icons/go";

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'


export default function MindMapPage() {

    //@ts-ignore
    const setUser = useUser((state) => state.setUser)

    const [mindmaps, setMindMaps] = useState<MindMapType[] | []>([])

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [title, setTitle] = useState('')

    const toast = useToast()

    useEffect(() => {
        loadMindMaps()
    }, [])

    const loadMindMaps = async () => {
        const { data } = await api.get('/api/user/mindmaps')
        if (data.status) {
            setMindMaps(data.mindmaps)
        }
    }
    const AddMindMap = async () => {
        const { data } = await api.post('/api/user/mindmap', {
            title,
            data: JSON.stringify(initialdata)
        })
        const { status } = data
        if (status) {
            toast({
                title: 'New MindMap Created',
                position: 'top-right',
                duration: 2500
            })
            setMindMaps([])
            loadMindMaps()
            setTitle('')
            onClose()
        } else {
            toast({
                title: 'Failed To Create MindMap',
                position: 'top-right',
                duration: 2500,
                status: 'error'
            })
        }
    }


    const deleteMindMap = async (mindmap: MindMapType) => {
        try {
            const { data } = await api.delete(`/api/user/mindmap/${mindmap._id}`)
            const { status } = data
            if (status) {
                setMindMaps(mindmaps.filter((m : MindMapType) => m._id!== mindmap._id))
                toast({
                    title: 'MindMap Deleted',
                    position: 'top-right',
                    duration: 2500
                })
            }
        } catch (error) {
            toast({
                title: 'Failed To Delete MindMap',
                position: 'top-right',
                duration: 2500,
                status: 'error'
            })
        }
    }

    return <Stack>
        <SideBar>
            <Button onClick={onOpen} bg={'app.btnPurple'} color={'white'} m={4}>Add New MindMap</Button>
            <Flex flexWrap={'wrap'} p={4} gap={5}>
                {mindmaps.map(mindmap => {
                    return <MinMapCard mindmap={mindmap} key={mindmap._id} deleteMindMap={deleteMindMap} />
                })}
            </Flex>



            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>create new MindMap</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input onChange={(e) => setTitle(e.target.value)} />
                        </FormControl>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='outline' onClick={AddMindMap} >Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SideBar>
    </Stack>
}


const MinMapCard = ({ mindmap  , deleteMindMap }: { mindmap: MindMapType , deleteMindMap: (mindmap: MindMapType) => void }) => {

  

    return <Center py={12}>
        <Box
            role={'group'}
            p={6}
            maxW={'330px'}
            w={'full'}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'lg'}
            pos={'relative'}
            zIndex={1}>
            <Link href={`/dashboard/mindmap/${mindmap._id}`} >
                <Box
                    rounded={'lg'}
                    mt={-12}
                    pos={'relative'}
                    height={'230px'}
                    _after={{
                        transition: 'all .3s ease',
                        content: '""',
                        w: 'full',
                        h: 'full',
                        pos: 'absolute',
                        top: 5,
                        left: 0,
                        backgroundImage: `url(${mindmap.thumbnail})`,
                        filter: 'blur(15px)',
                        zIndex: -1,
                    }}
                    _groupHover={{
                        _after: {
                            filter: 'blur(20px)',
                        },
                    }}>
                    <Image
                        rounded={'lg'}
                        height={200}
                        width={200}
                        objectFit={'contain'}
                        src={mindmap.thumbnail}
                        alt="#"
                    />
                </Box>
            </Link>
            <Stack align={'center'}>
                <Link href={`/dashboard/mindmap/${mindmap._id}`} >
                    <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                        {mindmap.title}
                    </Heading>
                </Link>
                <Menu>
                    <MenuButton >
                        <GoKebabHorizontal />
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={()=> deleteMindMap(mindmap)} >Delete</MenuItem>
                    </MenuList>
                </Menu>
            </Stack>
        </Box>

    </Center>
}


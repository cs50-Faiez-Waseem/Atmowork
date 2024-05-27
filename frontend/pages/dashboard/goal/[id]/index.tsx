import SideBar from "@/components/dashboard/sidebar";
import PageLayout from "@/components/page-layout";
import {
    Box, Button, HStack, Stack, Text, Avatar, Badge, CircularProgress, CircularProgressLabel,

    Modal, ModalHeader, useDisclosure, ModalOverlay, ModalContent, FormControl, Input,
    FormLabel, ModalFooter, ModalBody, ModalCloseButton, Select,
    useToast

} from "@chakra-ui/react";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import api from "@/utils/fetcher";
import useUser from "@/providers/userStore";
import moment from "moment";

import { MdEditNote } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { set } from "js-cookie";

export default function Goal() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const params = useParams();
    const { id } = params;

    const toast = useToast()

    // @ts-ignore
    const user = useUser(state => state.users)

    const dateInitial = new Date()
    const [deadline, setDeadline] = useState(dateInitial);

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskStatus, setTaskStatus] = useState('inprogress')

    const [goal, setGoal] = useState('')
    const [tasks, setTasks] = useState([])

    const [completedTask, setCompletedTask] = useState(0)
    const [incompleteTask, setIncompleteTask] = useState(0)

    const [task , setTask] = useState<any>({})

    const [progress, setProgress] = useState(0)


    useEffect(() => {
        if (id) {
            getGoalDetails()
        }
    }, [])

    useEffect(() => {
        if (tasks) {
            setCompletedTask(tasks.filter(task => task.status === 'completed').length)
            setIncompleteTask(tasks.filter(task => task.status === 'inprogress').length)
        }
    }, [tasks])

    useEffect(() => {
        setProgress(((Number(completedTask) / Number(tasks.length)) * 100) || 0)
    }, [completedTask])

    const getGoalDetails = async () => {
        try {

            const { data } = await api.get(`/api/user/goal/${id}`);

            const { status, goal, tasks } = data

            if (status) {
                setGoal(goal)
                setTasks(tasks)
                console.log(goal)
                console.log(tasks)
            } else {
                toast({
                    duration: 3000,
                    title: 'Failed To Get Goal',
                    description: data?.message,
                    position: 'top-right'
                })
            }


        } catch (error) {
            toast({
                duration: 3000,
                title: 'Network Request Failed',
                description: error?.message,
                position: 'top-right'
            })
        }
    }

    const createTask = async () => {
        try {
            if (taskTitle.length < 5) {
                toast({
                    duration: 3000,
                    title: 'Empty Feilds',
                    description: 'Title Length Should be greater than 5',
                    position: 'top-right',
                    status: 'warning'
                })
            }

            const { data } = await api.post(`/api/user/goal/${id}/task`, {
                title: taskTitle,
                description: taskDescription,
                status: taskStatus,
                deadline
            })

            const { status, task } = data;

            if (status) {
                setTasks(prev => [...tasks, task])
                setTaskTitle('')
                setTaskDescription('')
                setDeadline(dateInitial)
                toast({
                    title: 'Task Created',
                    position: 'top-right',
                    duration: 3000,
                    status: 'success',
                    isClosable: true
                })
            } else {
                toast({
                    title: 'Task Creation Failed',
                    position: 'top-right',
                    duration: 3000,
                    status: 'error',
                    isClosable: true
                })
            }

        } catch (err) {
            toast({
                title: 'Network Error',
                description: err.message,
                position: 'top-right',
                duration: 3000,
                status: 'error',
                isClosable: true
            })
        }
    }

    function getMonth() {
        // Get the current date
        var currentDate = new Date();

        // Extract the current month and year
        var currentMonth = currentDate.getMonth();
        var currentYear = currentDate.getFullYear();

        // Calculate the next month
        var nextMonth = currentMonth + 1;
        if (nextMonth > 11) {
            nextMonth = 0;
            currentYear++;
        }

        // Array of month names
        var monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Get the text representation of the current and next month
        var currentMonthText = monthNames[currentMonth];
        var nextMonthText = monthNames[nextMonth];

        // Combine the current and next month into a single string
        var result = currentMonthText + "-" + nextMonthText;

        return result;
    }
    function greetUser() {
        // Get the current date and time
        var currentTime = new Date();
        var currentHour = currentTime.getHours();

        // Define the greeting based on the time of day
        var greeting;
        if (currentHour < 12) {
            greeting = "Good morning";
        } else if (currentHour < 18) {
            greeting = "Good afternoon";
        } else {
            greeting = "Good evening";
        }
        return greeting;
    }


    const onEditTask = async (task) => {
        console.log(task)
        setTaskTitle(task.title)
        setTaskDescription(task.description)
        setTaskStatus(task.status)
        setTask(task)
        setIsEditModalOpen(prev => !prev)
    }

    const updateTask = async () => {
        try {
            const updateObj = {
                title: taskTitle,
                description: taskDescription,
                status: taskStatus,
                deadline
            }
            const { data } = await api.put(`/api/user/goal/task/${task._id}`, updateObj )
            const { status } = data
            if (status) {
                setTasks(prev => prev.map(t => t._id === task._id ? {...task , ...updateObj} : t))
                setTaskTitle('')
                setTaskDescription('')
                setDeadline(dateInitial)
                setIsEditModalOpen(prev => !prev)
                toast({
                    title: 'Task Updated',
                    position: 'top-right',
                    duration
                        : 3000,
                    status: 'success',
                })
            }
        } catch (err) {
            toast({
                title: 'Network Error',
                description: err.message,
                position: 'top-right',
                duration: 3000,
                status: 'error',
                isClosable: true
            })
        }
    }

    const onDeleteTask = async (task) => {
        try {
            const { data } = await api.delete(`/api/user/goal/task/${task._id}`)

            const { status } = data

            if (status) {
                setTasks(tasks.filter(t => t._id !== task._id))
                toast({
                    title: 'Task Deleted',
                    position: 'top-right',
                    duration: 3000,
                    status: 'success',
                    isClosable: true
                })
                console.log(tasks)
            } else {
                toast({
                    title: 'Task Deletion Failed',
                    position: 'top-right',
                    duration: 3000,
                    status: 'error',
                    isClosable: true
                })
            }

        } catch (error) {
            toast({
                title: 'Network Error',
                description: error.message,
                position: 'top-right',
                duration: 3000,
                status: 'error',
                isClosable: true
            })
        }
    }

    const onCancel = () => {
        setTaskDescription('')
        setTaskTitle('')
        setTaskStatus('')
        setIsEditModalOpen(prev => !prev)
    }

    return (
        <PageLayout
            title={`Goals | Workspace`}
            description='Atmowork Goals'
            logo='../../logo_transparent.png'
            fav='../favicon.png'
        >
            <Stack width={'98.5vw'} gap={0}>
                <SideBar>
                    <HStack p={4} justify={'space-between'} >
                        <HStack>
                            <Box boxShadow={'sm'} rounded={'md'} >
                                <MdOutlineStarPurple500 size={48} color="orange" />
                            </Box>
                            <Text fontSize={'3xl'} fontWeight={'bold'} color={'gray.600'} >{goal?.title}</Text>
                            <CircularProgress value={progress} color='green.400'>
                                <CircularProgressLabel>{progress}%</CircularProgressLabel>
                            </CircularProgress>
                        </HStack>

                        <Button leftIcon={<FaPlus />} colorScheme='purple' variant='solid' onClick={onOpen} >
                            New Goal
                        </Button>
                    </HStack>
                    {/* User Greetings */}
                    <HStack p={4}  >
                        <Avatar size={'lg'} src={'https://avatars.githubusercontent.com/u/6643991?v=4'} />
                        <Stack p={0} m={0} >
                            <HStack lineHeight={0.8} p={0} m={0} >
                                <Text fontSize={'xl'} fontWeight={'bold'} color={'gray.600'} >{greetUser()}</Text>
                                <Text fontSize={'xl'} fontWeight={'bold'} color={'purple'} >{user?.username}</Text>
                                <Text fontSize={'xl'} fontWeight={'bold'} color={'gray.600'} >!</Text>
                            </HStack>
                            <HStack lineHeight={1} p={0} m={0} >
                                <Text fontSize={'md'} color={'gray.600'} >You have</Text>
                                <Text fontSize={'md'} textDecoration={'underline'} color={'purple'} >{tasks.length} Goals</Text>
                            </HStack>
                        </Stack>
                    </HStack>
                    {/* Completion Stats */}
                    <HStack p={4} borderBottom={'1px solid gray'} borderTop={'1px solid gray'}
                        justify={'space-between'}
                        alignItems={'center'}
                    >
                        <HStack>
                            <MdOutlineStarPurple500 color="gray" size={28} />
                            <Stack>
                                <Text lineHeight={0.7} >Monthly Goals</Text>
                                <Text lineHeight={0.3} fontSize={'sm'} color={'gray.500'} fontStyle={'italic'} >{getMonth()}</Text>
                            </Stack>
                        </HStack>
                        <HStack w={{ base: '50%', lg: '20%' }} justify={'space-evenly'} >
                            <Stack>
                                <Text fontSize={'sm'} > Incomplete</Text>
                                <Box w={'100px'} bg={'white'} boxShadow={'md'} textAlign={'center'} py={1} px={2} borderRadius={4} >
                                    <Text fontSize={14} >{incompleteTask}</Text>
                                </Box>
                            </Stack>
                            <Stack>
                                <Text fontSize={'sm'} >Completed</Text>
                                <Box w={'100px'} bg={'white'} boxShadow={'md'} textAlign={'center'} py={1} px={2} borderRadius={4} >
                                    <Text fontSize={14} >{completedTask}</Text>
                                </Box>
                            </Stack>
                        </HStack>

                    </HStack>
                    {/* Goal Cards  */}
                    <HStack p={4} flexWrap={'wrap'} justify={'space-evenly'} gap={3} >
                        {tasks.map((task, index) => (
                            <GoalCard key={index} task={task} onDeleteTask={onDeleteTask} onEditTask={onEditTask} />
                        ))}
                    </HStack>
                    {/* Add Modal */}
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Create new Goal Task</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel color={'gray.500'}>Title</FormLabel>
                                    <Input size={'sm'} placeholder='Title'
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}

                                    />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel color={'gray.500'} >Description</FormLabel>
                                    <Input size={'sm'} placeholder='Description'
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel color={'gray.500'} >Progress Status</FormLabel>
                                    <Select size={'sm'}
                                        value={taskStatus}
                                        onChange={(e) => setTaskStatus(e.target.value)}
                                    >
                                        <option value="inprogress">InProgress</option>
                                        <option value="completed">Completed</option>
                                    </Select>
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel color={'gray.500'} >Deadline</FormLabel>
                                    <SingleDatepicker
                                        name="start date"
                                        date={deadline}
                                        onDateChange={setDeadline}
                                    />
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} px={6} rounded={2} onClick={createTask} >
                                    Save
                                </Button>
                                <Button onClick={onClose} px={6} rounded={2} >Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    {/* Edit Modal */}
                    <Modal
                        isOpen={isEditModalOpen}
                        onClose={onCancel}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Create new Goal Task</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel color={'gray.500'}>Title</FormLabel>
                                    <Input size={'sm'} placeholder='Title'
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel color={'gray.500'} >Description</FormLabel>
                                    <Input size={'sm'} placeholder='Description'
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel color={'gray.500'} >Progress Status</FormLabel>
                                    <Select size={'sm'}
                                        value={taskStatus}
                                        onChange={(e) => setTaskStatus(e.target.value)}
                                    >
                                        <option value="inprogress">InProgress</option>
                                        <option value="completed">Completed</option>
                                    </Select>
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel color={'gray.500'} >Deadline</FormLabel>
                                    <SingleDatepicker
                                        name="start date"
                                        date={deadline}
                                        onDateChange={setDeadline}
                                    />
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} px={6} rounded={2} onClick={updateTask} >
                                    update
                                </Button>
                                <Button onClick={onCancel} px={6} rounded={2} >Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </SideBar>
            </Stack>
        </PageLayout>
    )
}




const GoalCard = ({ task, onEditTask, onDeleteTask }) => {
    return (
        <Stack width={'30%'} boxShadow={'md'} p={4} m={0} rounded={'md'} bg={'white'} >
            <HStack justify={'space-between'} >
                <Box>
                    <Badge variant='outline' colorScheme='orange' >{task?.status}</Badge>
                </Box>
                <HStack cursor={'pointer'}>
                    <MdEditNote size={22} color="blue" onClick={() => onEditTask(task)} />
                    <FaTrash color="red" onClick={() => onDeleteTask(task)} />
                </HStack>
            </HStack>
            <Text>{task?.title}</Text>
            <Text color={'gray.500'} fontSize={'smaller'} >DeadLine : {moment(task?.deadline).format('DD MMMM YYYY')}</Text>
        </Stack>
    )
}
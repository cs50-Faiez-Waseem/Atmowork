

import { useDisclosure, Input, Flex, FormLabel, Button, Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, ModalCloseButton, ModalFooter, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Select } from '@chakra-ui/react'


export default function AddNewTask({ addCard }) {
    const { isOpen, onOpen, onClose } = useDisclosure()


    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const dateInitial = new Date()
    const [start_date, setStartDate] = useState(dateInitial);
    const [end_date, setEndDate] = useState(dateInitial);

    const [lane, setLane] = useState('')

    const toast = useToast()

    const addTask = () => {

        if (title.length < 3) {
            toast({
                title: 'Title is Too Short',
                description: 'Please Enter Minimum of 3 letter',
                status: 'warning',
                duration: 4000,
                position: 'top-right'
            })
            return;
        }
        if (!checkIfStartDateIsNotOlderThanCurrentDate(start_date)) {
            toast({
                title: 'Invalid Start Date',
                description: 'Invalid Start Date. Cant Select Older Date',
                status: 'warning',
                duration: 4000,
                position: 'top-right'
            })
            return;
        }
        if (!checkIfStartDateIsNotOlderThanCurrentDate(end_date)) {
            toast({
                title: 'Invalid Ending Date',
                description: 'Invalid Ending Date. Cant Select Older Date',
                status: 'warning',
                duration: 4000,
                position: 'top-right'
            })
            return;
        }

        addCard({ title, description, start_date, end_date }, lane);
        setTitle("");
        setDescription("")

        onClose()
    }
    function checkIfStartDateIsNotOlderThanCurrentDate(start_date) {
        const current_date = new Date().setHours(0, 0, 0, 0);

        if (start_date >= current_date) {
            return true;
        } else {
            return false;
        }
    }
    return (
        <>
            <Button onClick={onOpen} maxW={'150px'} >+Add New Task</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex
                            flex="1"

                            borderRadius="md"

                            flexDirection="column"
                            p={2}

                        >
                            <Input
                                placeholder="Task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <br />
                            <Input
                                placeholder="Task Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <br />
                            <Flex>
                                <SingleDatepicker
                                    name="start date"
                                    date={start_date}
                                    onDateChange={setStartDate}
                                />
                                <SingleDatepicker
                                    name="End Date"
                                    date={end_date}
                                    onDateChange={setEndDate}
                                />
                            </Flex>
                            <Select placeholder='Select KanbanLane' mt={5} onChange={(e) => setLane(e.target.value)} >
                                <option value='Todo'>Todo</option>
                                <option value='InProgress'>InProgress</option>
                                <option value='Done'>Done</option>
                            </Select>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='outline' onClick={addTask} >Add Task</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
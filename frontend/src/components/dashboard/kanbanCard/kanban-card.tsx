
import { Flex, Text, Tooltip, VStack, HStack, IconButton, Textarea } from '@chakra-ui/react'
import { Avatar } from "@chakra-ui/react";
import { KanbanCardType, UserType, featuresProps } from "@/types/types"
import { CSS } from '@dnd-kit/utilities';
import { ImBin } from "react-icons/im";
import { MdFlag } from "react-icons/md"
import { useDraggable } from '@dnd-kit/core';

import { useDisclosure, Input, FormLabel, Button, Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, ModalCloseButton, ModalFooter, useToast } from "@chakra-ui/react"
import { useState } from 'react';
import api from '@/utils/fetcher';

import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

const KanbanCard = ({ title, index, parent, item, removeCard, project, loadFeatures }: KanbanCardType) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    // @ts-ignore
    const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
        id: `card-${item._id}`,
        data: {
            title,
            item,
            index,
            parent
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),

    };

    const [feature, setFeature] = useState<featuresProps | null>(item)

    const members = [...(project?.members || []), { ...(project?.creatorid || {}) }];

    const [selectedMember, setSelectedMember] = useState<UserType | null>(null)

    const memberSelectionChange = (value: string) => {
        // @ts-ignore
        setSelectedMember(members.find(member => member && member.username && member.username === value));
    }

    const updateTask = async () => {
        console.log(feature)
        if (feature.title.length > 0) {
                const { data } = await api.put(`/api/user/feature/${item._id}`, { ...feature, assigned: selectedMember && selectedMember?._id });
                const { status } = data
                if (status) {
                    onClose()
                    toast({
                        title: 'Task Updated',
                        position: 'top-right',
                        duration: 4000,
                        isClosable: true,
                        status: 'info'
                    })
                    loadFeatures()
                } else {
                    toast({
                        title: 'Task Updation Failed',
                        position: 'top-right',
                        duration: 4000,
                        isClosable: true,
                        status: 'error'
                    })
                }
        }
    }

    return (
        <Flex
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            direction={'row'}
            bg="white"
            p={2}
            m={1}
            borderColor={'gray.200'}
            borderWidth={.13}
            borderRadius="sm"
            boxShadow="sm"
            w={300}
            maxH={120}
            justifyContent="center"
            onClick={onOpen}
        >
            <VStack width={'80%'}>
                <Text fontSize={14} width={'100%'} textAlign={'start'} fontWeight={'medium'} >{item.title}</Text>
                <Text fontSize={12} width={'100%'} textAlign={'start'} >{item.description}</Text>
                <HStack width={'100%'}>
                    <MdFlag />
                    <Text width={'100%'} fontSize={12} color={'gray.400'} >{`${item?.start_date ? new Date(item?.start_date).toLocaleDateString() : 'nill'} - ${item?.end_date ? new Date(item?.end_date).toLocaleDateString() : 'nill'}`}</Text>
                </HStack>
            </VStack>
            <VStack width={'20%'} justifyContent={'end'} cursor={'pointer'} >
                <Tooltip label={item?.assigned?.username} >
                    <Avatar size='xs' name={item?.assigned?.username} src={`https://placehold.co/100x100/000/FFF?text=${item?.assigned?.username?.charAt(0)}&font=roboto`} />
                </Tooltip>
                <IconButton
                    icon={<ImBin color='red' aria-label='test' />}
                    aria-label=''
                    onClick={() => {
                        removeCard(item._id)
                    }}
                />
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Task Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HStack>
                            <FormLabel color={'gray.500'} >Title</FormLabel>
                            <Input value={feature.title} placeholder='Please Enter Some title'
                                onChange={(e) => setFeature({ ...feature, title: e.target.value })}
                            />
                        </HStack>
                        <HStack mt={5}>
                            <FormLabel color={'gray.500'} >Description</FormLabel>
                            <Textarea value={feature.description}
                                onChange={(e) => setFeature({ ...feature, description: e.target.value })}
                            />
                        </HStack>
                        <HStack mt={5}>
                            <FormLabel color={'gray.500'} >Assigned to :</FormLabel>
                            <Tooltip label={item?.assigned?.username} >
                                <Avatar size='xs' name={feature?.assigned?.username} src={`https://placehold.co/100x100/000/FFF?text=${item?.assigned?.username?.charAt(0)}&font=roboto`} />
                            </Tooltip>
                        </HStack>
                        <HStack width={'100%'} mt={5} >
                            <MdFlag />
                            <Text width={'100%'} fontSize={12} color={'gray.400'} >{`${item?.start_date ? new Date(item?.start_date).toLocaleDateString() : 'nill'} - ${item?.end_date ? new Date(item?.end_date).toLocaleDateString() : 'nill'}`}</Text>
                        </HStack>
                        <HStack width={'100%'} mt={5} >
                            <FormLabel color={'gray.500'} >Assign</FormLabel>
                            <Tooltip label={item?.assigned?.username} >
                                <Avatar size='xs' name={feature?.assigned?.username} src={`https://placehold.co/100x100/000/FFF?text=${item?.assigned?.username?.charAt(0)}&font=roboto`} />
                            </Tooltip>
                            <AutoComplete openOnFocus onChange={memberSelectionChange} >
                                <AutoCompleteInput variant="filled" />
                                <AutoCompleteList >
                                    {members.map((person, oid) => (
                                        <AutoCompleteItem
                                            key={`option-${oid}`}
                                            value={person.username}
                                            textTransform="capitalize"
                                            align="center"
                                        >
                                            <Avatar size="sm" name={person.username} src={`https://placehold.co/100x100/000/FFF?text=${person?.username?.charAt(0)}&font=roboto`} />
                                            <Text ml="4">{person.username}</Text>
                                        </AutoCompleteItem>
                                    ))}
                                </AutoCompleteList>
                            </AutoComplete>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='outline' onClick={updateTask}  >Update</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}


export default KanbanCard
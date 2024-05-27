import React, { useEffect, useRef, useState, useCallback } from 'react';

import {
    Stack, Flex, Text, HStack, Box, Image,
    useToast
} from '@chakra-ui/react'
import { Input, } from '@chakra-ui/react'

import { filesize } from "filesize";
import { FaFile } from "react-icons/fa";
import { HiDocumentRemove } from "react-icons/hi";


import { FaFileMedical } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";

import { useDropzone } from 'react-dropzone'
import api from '@/utils/fetcher';
import useUser from '@/providers/userStore';
import moment from 'moment';
import { socket } from '@/utils/socket';

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'
import { CiMenuKebab } from "react-icons/ci";

interface ChatContainerProps {
    id: string
}

const ChatContainer = ({ id }: ChatContainerProps) => {

    const [chats, setChats] = useState([]);
    const divRef = useRef(null);
    const toast = useToast();
    const [isConnected, setConnected] = useState(false);
  
    const filterById = useCallback((id) => {
      setChats(prevChats => prevChats.filter(chat => chat._id !== id));
    }, []);
    useEffect(() => {
        loadInitialMessage()
    }, [id])
  
    useEffect(() => {
      if (!isConnected) {
        socket.connect();
        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        socket.on(`${id}-new-message`, (message) => {
          setChats(prevChats => [...prevChats, JSON.parse(message)]);
        });
        socket.on(`chat-remove-message`, (message) => {
          filterById(JSON.parse(message)._id);
        });
      }
  
      return () => {
        socket.off('connect', console.log);
        socket.off('disconnect', console.log);
      };
    }, [filterById, id, isConnected]);


    const loadInitialMessage = async () => {
        if (!id) return
        try {
            const { data } = await api.get(`/api/project/messages/${id}`)
            const { success, messages } = data
            if (success) {
                setChats(messages)
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error loading messages',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return <Flex flex="1" flexDir={'column'} p={4} bg={'whiteAlpha.700'} borderRadius={6} height={'70vh'} overflowY={'scroll'} ref={divRef} >
        {chats.map((chat) => (
            <ChatMessage key={chat.id} message={chat} />
        ))}
    </Flex>
}


interface ChatInputProps {
    selectedFiles: File[],
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>,
    id: string
}



const ChatInput = ({ selectedFiles, setSelectedFiles, id }: ChatInputProps) => {

    const { getRootProps, getInputProps } = useDropzone()

    const [message, setMessage] = useState('')

    const toast = useToast()

    const sendMessage = async () => {
        try {

            // First Check if there is a message written
            if (message.length == 0) {
                toast({
                    title: 'Error',
                    description: 'Message is empty',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                return;
            }

            // the Remove more than 10 Files as we support max 10files upload at a time
            if (selectedFiles.length > 10) {
                toast({
                    title: 'Error',
                    description: `Maximum 10 files Can Be Uploaded, Please Remove ${selectedFiles.length - 10} Files`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                return;
            }

            // Then start Uploading Files if there are any
            let files = []
            if (selectedFiles.length > 0) {
                const response = await uploadFile(selectedFiles)
                console.log(response)
                if (response.status) {
                    files = response.files
                }
            }




            const { data } = await api.post(`/api/project/message/${id}`, {
                message,
                files
            })

            const { success, message: newMessage } = data
            console.log(success)
            if (success) {
                setMessage('')
                setSelectedFiles([])
            }


        } catch (err) {
            toast({
                title: 'Error',
                description: err.message,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    const uploadFile = async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        })
        const { data } = await api.post(`/api/upload/project/file/${id}`, formData)
        return data
    }

    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage()
        }
    }


    return <HStack width={'100%'} p={2} flexDir={'column'} position={'relative'} >
        <HStack p={4} borderRadius={6} width={'100%'} overflowX={selectedFiles.length > 6 ? 'scroll' : 'hidden'} position={'absolute'} bottom={20} background={'white'} >
            {selectedFiles.map((file, index) => (
                <FileItem file={file} key={index} onfileRemove={(file) => {
                    setSelectedFiles(prev => prev.filter(f => f !== file))
                }} />
            ))}
        </HStack>
        <HStack boxShadow={'lg'} bg={'#FFF'} p={4} width={'100%'} borderRadius={6} >
            <Box _hover={{
                cursor: 'pointer',
                color: 'gray.600',
            }}
                {...getRootProps()}
            >
                <input {...getInputProps()} type='file' multiple onChange={(e) => {
                    const files = e.target.files;
                    console.log(files)
                    console.log(files.length)
                    for (let i = 0; i < files.length; i++) {
                        setSelectedFiles(prev => [...prev, files.item(i)])
                    }
                }} />
                <FaFileMedical size={20} />
            </Box>
            <Input mx={5} variant='unstyled' placeholder='Enter Some Message Here...' autoFocus
                onKeyPress={onKeyPress}
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value)
                }} />
            <Box _hover={{
                cursor: 'pointer',
                color: 'gray.600',
            }}>
                <FiSend size={20} />
            </Box>
        </HStack>
    </HStack>
}

const FileItem = ({ file, onfileRemove }: { file: File, onfileRemove: (file: File) => void }) => {

    const getFileName = () => {
        const filename = file.name
        if (filename.length > 30) {
            return filename.slice(0, 30) + '...'
        }
        return filename
    }

    return <HStack border={`1px solid gray`} borderRadius={3} p={2} minW={200} >
        <Stack width={'100%'}>
            <HStack justifyContent={'space-between'} width={'100%'} >
                <FaFile />
                <Box _hover={{
                    cursor: 'pointer',
                    color: 'gray.600',
                }}
                    onClick={() => onfileRemove(file)}
                >
                    <HiDocumentRemove color='red' size={20} />
                </Box>

            </HStack>
            <Text>{getFileName()}</Text>
            <Text>{filesize(file.size)}</Text>
        </Stack>
    </HStack>
}

function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');

    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

const ChatMessage = ({ message }) => {
    //@ts-ignore
    const user = useUser(state => state.users)
    const isSender = message.creatorid?._id === user?._id


    const toast = useToast()

    const copy = () => {
        copyTextToClipboard(message.message)
        toast({
            title: 'Copied',
            description: 'Message Copied',
            status: 'success',
            position: 'top-right',
            duration: 2000,
        })
    }

    const deleteMessage =  async () => {
       try {
        
        const { data} = await api.delete('/api/project/message/'+message._id)
        console.log(data)
       } catch (error) {
        console.log(error)
       } 
    }

    return <HStack justify={isSender ? 'flex-end' : 'flex-start'} my={2} >
        <Box boxShadow={'sm'} bg={'#FFF'} p={1} width={'auto'} maxW={'90%'} borderColor={'gray.100'} borderRadius={3} borderWidth={'1.5px'} >
            <Text fontWeight={'400'} fontSize={'sm'} fontStyle={'italic'} color={'gray.600'} >{isSender ? 'You' : message?.creatorid?.username}</Text>
            <HStack >
                {message.files.map(file => {
                    const fileUrl = `${process.env.NEXT_PUBLIC_backendURL}/${file.filepath}`
                    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                        return <Image src={fileUrl} maxH={150} width={'auto'}
                            onClick={() => {
                                window.open(fileUrl)
                            }} />
                    } else if (file.mimetype == 'video/mp4' || file.mimetype == 'video/webm' || file.mimetype == 'video/mov') {
                        return <video src={fileUrl} width={'400px'} height={150} controls onClick={() => {
                            window.open(fileUrl)
                        }} />
                    } else {
                        return <HStack border={`1px solid gray`} borderRadius={3} p={2} maxW={80}
                            onClick={() => {
                                window.open(fileUrl)
                            }}
                            cursor={'pointer'}
                        >
                            <Stack width={'100%'}>
                                <HStack justifyContent={'space-between'} width={'100%'} >
                                    <FaFile />
                                </HStack>
                                <Text>{file.filename}</Text>
                                <Text>{filesize(file.size)}</Text>
                            </Stack>
                        </HStack>
                    }
                })}
            </HStack>
            <Text fontSize={'md'} >{message?.message}</Text>
            <Text fontSize={'smaller'} fontStyle={'italic'} color={'gray.400'} >{moment(message?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
        </Box>
        <Menu>
            <MenuButton >
                <CiMenuKebab />
            </MenuButton>
            {isSender &&
                <MenuList>
                    <MenuItem onClick={copy} >Copy Text</MenuItem>
                    <MenuItem  onClick={deleteMessage} >Delete</MenuItem>
                </MenuList>
            }
            {!isSender &&
                <MenuList>
                    <MenuItem onClick={copy} >Copy Text</MenuItem>
                </MenuList>
            }

        </Menu>
    </HStack>
}





export {
    ChatContainer,
    ChatInput
}
'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  useToast,
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import useUser from '@/providers/userStore'
import { useEffect, useState } from 'react'
import api from '@/utils/fetcher'
import { useRouter } from 'next/router'

export default function UserProfileEdit() {

  //@ts-ignore
  const user = useUser(state => state.users)
  //@ts-ignore
  const setUser = useUser(state => state.setUser)


  const [username, setUsername] = useState(user?.username)
  const [email, setEmail] = useState(user?.email)

  const toast = useToast()

  const navigate = useRouter()

  useEffect(() => {
    if (!user) {
      api.get('/api/user/me').then(res => {
        setUser(res.data)
      })
    }
    console.log(user)

  }, [user])

  const onSave = async () => {
    const res = await api.put('/api/user/', {
      username,
      email,
    })
    if (res.data.status) {
      toast({
        title: 'Success',
        description: 'User profile updated successfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top'
      })
      setUser({ ...user, email, username })
    }
  }

  const selectFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    console.log(fileInput);
    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      console.log(file);

      if (file) {
        const res = await uploadFile([file])
        if (res.status) {
          console.log(res.files);
          const result = await api.put('/api/user/', {
            profile_pic: res.files[0].filepath,
          })
          setUser({ ...user, email, profile_pic: process.env.NEXT_PUBLIC_backendURL +'/'+ res.files[0].filepath })
        }
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const uploadFile = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    })
    const { data } = await api.post(`/api/upload/project/file/profile`, formData)
    return data
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src={ user?.profile_pic?.includes('localhost')? user?.profile_pic : process.env.NEXT_PUBLIC_backendURL + '/' +  user?.profile_pic} >
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full" onClick={selectFile} >Change Icon</Button>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="userName" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}
            onClick={() => {
              navigate.back()
            }}
          >
            Go back
          </Button>
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}
            onClick={onSave}
          >
            SAVE
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}
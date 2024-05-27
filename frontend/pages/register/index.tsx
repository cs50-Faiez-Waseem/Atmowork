import React, { useEffect, useState } from "react";
import { Stack, Center, Text, HStack, Radio, RadioGroup, Input, Image, InputGroup, InputRightElement, Button, useBreakpointValue } from "@chakra-ui/react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import styles from '../../src/css/signin.module.css'
import { Carousel } from 'react-responsive-carousel';
import api from "@/utils/fetcher";
import { useToast } from '@chakra-ui/react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useUser from "@/providers/userStore";
import Pricing from "@/components/home/pricing";
import Link from "next/link";


export default function Register() {
    //@ts-ignore
    const setUser = useUser((state) => state?.setUser)
    const router = useRouter()
    const params = useSearchParams()

    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const [account_type, setAccountType] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setCPassword] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [plan, setPlan] = useState(params.get('plan'))

    const [message , setMessage ] = useState<string | null | undefined>('')

    const inviteCode = params.get('inviteCode')
    const projectid = params.get('projectid')
    
    const toast = useToast()
    
    useEffect(()=>{
        loadInviteEmail()
    },[plan])
    
    const loadInviteEmail =  async () =>{
        
        const code = params.get('inviteCode')
        if(code){
            const { data  } = await api.get(`/api/user/project/invite/${code}`)
            console.log(data)
            if(data.status){
                setEmail(data.data.email)
                setMessage('Please Use this email to create a new Account. Your Project Invite is sent on this email.')
            }else{
                alert('Cant find Email')
            }
        }
    }
    const onSubmit = async () => {
        try {
            setLoading(true)
            if (!validateEmail(email)) {
                toast({
                    title: 'Invalid Fields',
                    description: 'Invalid Email. Please Use a valid Email address!!',
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                    position: 'top'
                })
                setLoading(false)
                return;
            }
            if (account_type.length === 0) {
                toast({
                    title: 'Invalid Fields',
                    description: 'Please Select Account Type',
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                    position: 'top'
                })
                setLoading(false)
                return;
            }
            if (username.length === 0) {
                toast({
                    title: 'Invalid Fields',
                    description: 'Please Enter Username',
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                    position: 'top'
                })
                setLoading(false)
                return;
            }
            if (password.length === 0) {
                toast({
                    title: 'Invalid Fields',
                    description: 'Please Enter Password',
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                    position: 'top'
                })
                setLoading(false)
                return;
            }
            if (password != cpassword) {
                toast({
                    title: 'Invalid Fields',
                    description: 'Password and Confirm password does not match!!',
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                    position: 'top'
                })
                setLoading(false)
                return;
            }
            const body = {
                username,
                email,
                password,
                cpassword,
                account_type
            }
            const response = await api.post('/api/auth/register', body)
            const { success, message } = response.data;
            if (success) {
                setUser({ ...body, plan })
                console.log(response.data)
                setLoading(false)
                toast({
                    title: 'Account created',
                    description: message,
                    status: 'success',
                    duration: 6000,
                    isClosable: true,
                    position: 'top'
                })
                if(inviteCode && projectid && (inviteCode != 'null' || inviteCode != null || inviteCode != undefined)){
                    router.push('/user/payment?inviteCode='+inviteCode+'&projectid='+projectid, { scroll: false   })
                }else{
                    router.push('/user/payment', { scroll: false   })
                }
            } else {
                setLoading(false)
                toast({
                    title: 'Account creation Failed',
                    description: message,
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                    position: 'top'
                })
            }

        } catch (error) {
            setLoading(false)
            toast({
                title: 'Something Went Wrong!!',
                description: error.message,
                status: 'error',
                duration: 6000,
                isClosable: true,
                position: 'top'
            })
        }
    }
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }

    const getSigninPath = () => {
        let query = {  }

        if (inviteCode && projectid && inviteCode.length > 0 && projectid.length > 0) {
            query = { inviteCode, projectid }
        }
        return {
            pathname: '/signin',
            query: query
        }
    }

    if (plan) {
        return <Center className={styles.mainBg} >

            <HStack padding={({ base: 2, lg: 6 })} bgColor={'white'} borderRadius={8} shadow={'2xl'} maxH={'90vh'} maxW={({ base: '90vw', lg: '70vw' })} >
                <Stack
                    padding={({ base: 0, lg: 6 })} justifyContent={'space-around'}
                    borderRadius={8} bgColor={'#934DCA'}
                    width={(
                        { base: '0%', lg: '40%' }
                    )}
                    height={'85vh'}
                >
                    <Stack>
                        <Text color={'white'} >AtmoWork</Text>
                        <Text lineHeight={1} color={'white'} fontSize={26} fontWeight={'bold'} >Start Your journey with us.</Text>
                        <Text lineHeight={0.9} color={'white'} width={'70%'} >Discover the world’s best productivity management for big and small work.</Text>
                    </Stack>
                    <Stack marginTop={8}>
                        <Carousel>
                            <CarousalCard />
                            <CarousalCard />
                            <CarousalCard />
                        </Carousel>
                    </Stack>
                </Stack>
                <Center width={({ base: '100%', lg: '60%' })} height={'85vh'} paddingLeft={({ base: 0, lg: 5 })} >
                    <Stack width={({ base: '100%', lg: '90%' })} >
                        <Text lineHeight={0.4} fontSize={24} fontWeight={'bold'} >SignUp</Text>
                        <HStack marginY={4}>
                            <RadioGroup onChange={setAccountType} >
                                <HStack justifyContent={'space-between'} width={({ base: '70vw', lg: '30vw' })} alignItems={'center'} >
                                    <Stack width={'60%'} borderWidth={'1px'} borderColor={'gray.300'}
                                        paddingY={3} paddingX={({ base: 4, lg: 12 })} borderRadius={8} >
                                        <Radio value='INDIVIDUAL'>Personal</Radio>
                                    </Stack>
                                    <Stack width={'60%'} borderWidth={'1px'} borderColor={'gray.300'}
                                        paddingY={3} paddingX={({ base: 4, lg: 12 })} borderRadius={8} >
                                        <Radio value='TEAM'>Team</Radio>
                                    </Stack>
                                </HStack>
                            </RadioGroup>
                        </HStack>
                        <Text >Username :</Text>
                        <Input placeholder='Enter a Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <Text >Email :</Text>
                        <Input placeholder='Enter your Email address' value={email} onChange={(e) => setEmail(e.target.value)} />
                         {message && <Text color={'GrayText'} fontStyle={'italic'} fontSize={14} >*{message}</Text>}
                        <Text >Password :</Text>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <Text >Confirm Password :</Text>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                                value={cpassword} onChange={(e) => setCPassword(e.target.value)}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <Center>
                            <Button width={200} bgColor={'#934DCA'} color={'white'} onClick={onSubmit} isLoading={isLoading} >Register</Button>
                        </Center>
                        <HStack justifyContent={'center'} >
                            <Text textAlign={'center'}>Existing User?</Text>
                            <Link href={getSigninPath()}>
                                <Text color={'#934DCA'}>SignIn</Text>
                            </Link>
                        </HStack>
                    </Stack>
                </Center>
            </HStack>
        </Center>
    } else {
        return <Pricing onClick={(_plan) => setPlan(_plan)} />
    }
}



const CarousalCard = () => {
    return <Stack padding={8} bgColor={'#AE50CF'} borderRadius={8}  >
        <Text color={'white'} width={'100%'} >“Productivity is being able to do things that you were never able to do before.”</Text>
        <HStack>
            <Image src="../assets/images/user_icon.png" alt="avatar" w={'40px !important'} h={'40px !important'} />
            <Stack>
                <Text lineHeight={0.7} color={'white'} >Antony .Jr</Text>
                <Text color={'white'} >CEO at abc</Text>
            </Stack>
        </HStack>
    </Stack>
}
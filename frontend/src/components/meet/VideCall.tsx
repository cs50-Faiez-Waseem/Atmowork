import React, { useState, useEffect } from 'react'
import { Stack, Heading, Image, Center, HStack, Button, Text, useToast } from '@chakra-ui/react'
import meetingImg from '../../../public/assets/images/undraw_remote_meeting_re_abe7.svg'


import AgoraUIKit, { layout } from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'
import { redirect, useParams } from 'next/navigation'

import { IoGrid } from "react-icons/io5";
import { UserType } from '@/types/types'
import api from '@/utils/fetcher'
import { useRouter } from 'next/router'



export default function VideoCall() {

    const srchParams = new URLSearchParams(window.location.search)

    const [videocall, setVideocall] = useState(srchParams.get('join') ? true : false)
    const [isHost, setHost] = useState(true)
    const [isPinned, setPinned] = useState(true)
    const [username, setUsername] = useState('')
    const [members, setMembers] = useState(1)
    const [uniqueId, setUniqueId] = useState(10002)

    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setAuthenticated] = useState(false)

    const [duration, setDuration] = useState('')


    const p = useParams()


    const [channel, setChannel] = useState<string>('')

    const toast = useToast()

    const router = useRouter()

    useEffect(() => {
        if (p?.hostId) {
            // @ts-ignore
            setChannel(p.hostId)
            setUniqueId(generateRandomNumber(5))
            fetchUser()
            loadMeetInfo(p.hostId)
        }
    }, [p])

    const fetchUser = async () => {
        const { data } = await api.get('/api/user')
        if (data.status) {
            setUsername(data.user.username)
            setAuthenticated(true)
            setLoading(false)
        } else {
            toast({
                title: 'Authentication Failed',
                description: 'Please Login to continue',
                duration: 5000,
                isClosable: false,
                position: 'top-right'
            })
            router.push('/signin')
        }
    }
    async function loadMeetInfo(id) {
        try {
            const { data } = await api.get(`/api/user/meet/${id}`)
            if (data.status) {
                setInterval(() => {
                    meetingTimer(data.meet.start_time)
                }, 1000)
            } else {
                toast({
                    title: 'Meeting Not Found',
                    description: 'Please try again',
                    duration: 5000,
                    isClosable: false,
                    position: 'top-right'
                })
                router.push('/')
            }

        } catch (err) {
            toast({
                title : 'Server Error || Or User Not Authorized',
                description : 'Please try again with Authorized Account',
                duration : 5000,
                isClosable : false,
                position : 'top-right'
            })
            router.push('/')
        }
    }
    function generateRandomNumber(length: number): number {
        let characters = '0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return Number(code);
    }

    function meetingTimer(startTime: string) {
        const startTimeStamp = new Date(startTime).getTime()
        const now = new Date().getTime()
        const diff = now - startTimeStamp
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor(diff / (1000 * 60)) % 60
        const seconds = Math.floor(diff / 1000) % 60
        setDuration(`${hours}h ${minutes}m ${seconds}s`)
        if (minutes >= 59) {
            toast({
                title: 'Reminder',
                description: 'Meeting Will End in 1 Minutes',
                duration: 5000,
                isClosable: false,
                position: 'top-right'
            })
            router.push('/')
        }
        if (hours >= 1) {
            toast({
                title: 'Meeting Time Up',
                description: 'Create A new One',
                duration: 5000,
                isClosable: false,
                position: 'top-right'
            })
            router.push('/')
        }
    }



    if (loading) {
        return <>Wait Initializing...</>
    }


    if (!videocall && isAuthenticated) {
        return <Stack>
            <Center my={2}>
                <Image src={meetingImg.src} width={300} alt='Meeting Image' />
            </Center>
            <Center>
                <Heading m={8} color='red' >Join Video Call</Heading>
            </Center>
            <Center mb={3}>
                <Button colorScheme='purple' size='md'
                    onClick={() => {
                        if (channel) {
                            setVideocall(true)
                        }
                    }}
                >
                    join
                </Button>
            </Center>
        </Stack>
    } else if (window !== undefined && videocall && isAuthenticated) {
        return <Stack h={'100vh'} >
            <HStack padding={2} bg={'#805AD5'} justifyContent={'space-between'} >
                <Text color={'white'}>
                    Members {members}
                </Text>
                <Text color={'white'}>
                    Meet started  [{duration}] Ago
                </Text>
                <HStack spacing={2} >
                    <Button onClick={() => setPinned(!isPinned)}>
                        <IoGrid />
                    </Button>

                </HStack>
            </HStack>
            {videocall && <AgoraUIKit
                rtcProps={{
                    channel,
                    appId: process.env.NEXT_PUBLIC_AGORA_CLIENT,
                    token: null,
                    role: isHost ? 'host' : 'audience',
                    layout: isPinned ? layout.pin : layout.grid,
                    enableScreensharing: true,
                    screenshareUid: uniqueId,
                }}
                rtmCallbacks={{
                    channel: {
                        MemberCountUpdated(memberCount) {
                            setMembers(memberCount)
                        },
                        MemberJoined(memberId) {
                            console.log('MemberJoined', memberId)
                        },
                        MemberLeft(memberId) {
                            console.log('MemberLeft', memberId)
                        },
                    },
                    client: {
                        PeersOnlineStatusChanged(status) {
                            console.log('PeersOnlineStatusChanged', status)
                        },
                        MessageFromPeer(message, peerId, messageProps) {
                            console.log('MessageFromPeer', message, peerId, messageProps)
                        },
                    }
                }}
                rtmProps={{ username: username || 'user', displayUsername: true }}
                callbacks={{
                    EndCall: () => setVideocall(false),

                }}
                styleProps={{
                    usernameText : {
                        background : '#000'
                    },
                    videoMode : {
                        min : 'cover',
                        max : 'cover'
                    },
                    localBtnContainer : {
                        background : '#805AD5'
                    },
                    gridVideoCells : {
                        padding : 20,
                        border : '2px solid #000',
                        margin : 1,
                        width :'auto'
                    },
                    minViewContainer : {
                        border : '2px solid #000',
                        objectFit : 'cover'
                        
                    },
                    maxViewContainer : {
                        border : '2px solid #000',
                        margin : 1
                    }
                }}
            />}
        </Stack>
    }
}
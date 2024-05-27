import React, { useState, useEffect } from 'react'
import { Stack, Heading, Image, Center, InputGroup, Input, Button, InputRightElement, useToast} from '@chakra-ui/react'
import SideBar from '@/components/dashboard/sidebar/index'
import meetingImg from '../../../public/assets/images/undraw_remote_meeting_re_abe7.svg'
import { useRouter } from 'next/navigation'
import api from '@/utils/fetcher'


export default function Meet() {

    const [meetingLink, setMeetingLink] = useState<string | null>(null)
    const [meetingcode, setMeetingCode] = useState<string | null>(null)

    const toast = useToast()

    const navigate = useRouter();

    function generateRandomCode(length: number): string {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code;
    }


    const createMeetLink = async () => {
        const meetCode: string = generateRandomCode(8)
        const meetLink: string = `${window.location.origin}/meet/${meetCode}`
        
        const start_time = new Date().toISOString()
        
        const  { data } = await api.post('/api/user/meet', {
            meetCode,
            start_time
        })
        if(data.status){
            setMeetingCode(meetCode)
            setMeetingLink(meetLink)
        }else{
            toast({
                title : 'Meeting Creation Failed',
                description : data.message,
                duration : 5000,
                isClosable : false,
                position : 'top-right'
            })
        }
    }


    return <Stack>
        <SideBar>
            <Center my={2}>
                <Image src={meetingImg.src} width={300} />
            </Center>
            <Center>
                <Heading m={8} color='red' >Create Video Call</Heading>
            </Center>
            <Center mb={3}>
                <Button colorScheme='purple' isDisabled={meetingLink ? true : false} size='md' onClick={createMeetLink} >
                    New Meeting
                </Button>
                {meetingLink &&
                    <Button colorScheme='purple' size='md' ml={5} onClick={() => {
                        navigate.push(`/meet/${meetingcode}?join=true`)
                    }}>
                        Join
                    </Button>
                }
            </Center>
            {meetingLink &&
                <Center>
                    <Center w={'40%'} >
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={'text'}
                                value={meetingLink}
                                placeholder='Meet Link'
                                readOnly
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' 
                                
                                onClick={()=>{
                                    navigator.clipboard.writeText(meetingLink)
                                    toast({
                                        title : 'Copied',
                                        status : 'success',
                                        duration: 1000,
                                        position: 'top-right',
                                        description: 'Meeting Link Copied to Clipboard'
                                    })
                                }}
                                >
                                    Copy Link
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Center>
                </Center>
            }
        </SideBar>
    </Stack>
}
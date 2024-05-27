import React from 'react'
import { Stack , Heading} from '@chakra-ui/react'
import SideBar from '@/components/dashboard/sidebar/index'
import { useRouter } from 'next/router'
import useUser from '@/providers/userStore'
import Cookies from 'js-cookie'

export default function Home() {
    //@ts-ignore
    const setUser = useUser((state) => state.setUser)
    const router = useRouter();
    React.useEffect(() => {
        if(window){
            setUser(null) 
            // @ts-ignore
            Cookies.remove('token')
            router.replace('/')
        }
    }, [])
    return <Stack>
        <SideBar>
            <Heading  m={8} color='red' >Signing.. Out</Heading>
        </SideBar>
    </Stack>
}
import SideBar from "@/components/dashboard/sidebar";
import api from "@/utils/fetcher";
import { Box, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FcAdvertising } from "react-icons/fc";


export default function NotificationScreen() {

    const [notifications, setNotifications] = useState([])

    const toast = useToast()

    useEffect(() => {
        loadNotifications()
    }, [])

    const loadNotifications = async () => {
        try {
            const result = await api.get('/api/user/notifications')
            const { data } = result
            if (data.status) {
                setNotifications(data.notifications)
            } else {
                toast({
                    duration: 3000,
                    title: 'Failed To Get Notifications',
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

    return <SideBar>
        <HStack p={3} >
            <FcAdvertising />
            <Text fontWeight={'bold'} fontSize={22} >Notifications</Text>
        </HStack>
        {notifications.map((notification) => (
            <Stack m={3} p={3} boxShadow={'lg'} rounded={5} >
                <HStack>
                    <FcAdvertising />
                    <Text key={notification.id} fontStyle={'italic'} color={'gray.400'} fontSize={14} >{new Date(notification.createdAt).toDateString()}</Text>
                </HStack>
                <Text key={notification.id} fontWeight={'semibold'} >{notification.title}</Text>
                <Text key={notification.id} fontSize={16} >{notification.description}</Text>
            </Stack>
        ))}
    </SideBar>
}
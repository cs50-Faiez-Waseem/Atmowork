'use client'

import {
    Text,
    Card,
    Flex,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'



export default function TopProjects({ title, list }: any) {
    const router = useRouter();
    return (
        <Card w={'md'}>
            <Flex bg={'gray.200'} alignItems={'center'} p={3} roundedTop={6} >
                
                <Text ml={2} >{title}</Text>
            </Flex>
            {list.map(item => (
                <Flex p={3}  key={item._id} >
                    <Text onClick={()=> {
                        router.push('/dashboard/kanban/' + item._id)
                    }} textDecor={'underline'} _hover={{ cursor: 'pointer' }} >{item.title}</Text>
                </Flex>)
            )}

        </Card>
    )
}
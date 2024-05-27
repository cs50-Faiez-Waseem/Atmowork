
import { Flex } from '@chakra-ui/react';
import {
  HStack,
  Text,
  Box,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';

import { FiActivity } from 'react-icons/fi';

interface cardProps {
  color: string,
  title: string,
  value: string
}

export default function Card({ color, title, value }: cardProps){

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)')
  return (<HStack boxShadow={'0 2px 10px rgb(0 0 0 / 20%)'} m={!isLargerThan768 && 1} w={isLargerThan768 ? isLargerThan1200 ? '32%' : '46%' : '80%'} bg={color} h={isLargerThan768 ? 130 : 100}  >
    <Box w={'40%'} h={'100%'} bg={'rgba(0, 0, 0, 0.12)'} display='flex' justifyContent='center' alignItems='center'>
      <FiActivity color='white' size={32} />
    </Box>
    <VStack w={'60%'}>
      <Text fontWeight={'bold'} color='white'>{title}</Text>
      <Text fontWeight={'medium'} color='white'>{value}</Text>
    </VStack>
  </HStack>)
}
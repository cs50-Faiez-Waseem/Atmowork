'use client'

import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  useBreakpointValue
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import styles from '../../../css/home.module.css'

interface Props {
  children: React.ReactNode,
  style?: any
}

function PriceWrapper(props: Props) {
  const { children, style } = props

  return (
    <Box
      style={style}
      bgColor={'white'}
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'xl'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      maxW={{
        base : '250px',
        lg : '30%'
      }}
    >
      {children}
    </Box>
  )
}

interface PricingProps {
  onClick? : Function
}
export default function Pricing(props : PricingProps) {
  return (
    <Box py={16} className={styles.pricingBg}  id='pricing' >
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Plans that fit your need
        </Heading>
        <Text fontSize="lg" color={'gray.500'}>
          Start with 14-day free trial. No credit card needed. Cancel at anytime.
        </Text>
      </VStack>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign="center"
        justify="center"
        spacing={{ base: 2, lg: 2 }}
        py={10}
        marginTop={100}
        >
        <PriceWrapper
        >
          <Box py={4} px={12} width={240} minH={240} className={styles.roundHobby} >
            <Box >
              <Text fontWeight="500" fontSize="2xl" color={'rgba(94, 87, 178, 1)'}>
                Hobby
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  5
                </Text>
                <Text fontSize="3xl" color="gray.500">
                  /month
                </Text>
              </HStack>

            </Box>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}
            
            maxW={{
              base : '250px',
              lg : '100%'
            }}
            >
            <List width={'100%'} spacing={3} textAlign="start" px={12}  >
              <ListItem minW={250} >
                <ListIcon as={FaCheckCircle} color="green.500" />
                upto 10 projects
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                kanban Model & MindMapping
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                300mb/project
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button w="full" colorScheme="purple" variant="outline" onClick={()=>{
                props.onClick('Hobby')
              }} >
                Start
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>

        <PriceWrapper style={{
          translate: useBreakpointValue({ base: '0px -10px', lg: '0px -20px' })
        }} >
          <Box py={4} px={12} width={280} minH={280} className={styles.roundStandard} >
            <Box>
              <Text fontWeight="500" fontSize="2xl" color={'rgba(102, 180, 185, 1)'} >
                Standard
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  15
                </Text>
                <Text fontSize="3xl" color="gray.500">
                  /month
                </Text>
              </HStack>

            </Box>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'} 
            
            maxW={{
              base : '250px',
              lg : '100%'
            }}
            >
            <List width={'100%'} spacing={3} textAlign="start" px={12}  >
              <ListItem minW={250} >
                <ListIcon as={FaCheckCircle} color="green.500" />
                includes every thing from Hobby Project
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Add Team Member upto 5
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Enjoy Free Meet Sessions Upto an Hour
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button w="full" colorScheme="purple" onClick={()=>{
                props.onClick('Standard')
              }}  >
                Start
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>

        <PriceWrapper
          style={{
            maxWidth: 350
          }}
        >
          <Box py={4} px={12} width={240} minH={240} className={styles.roundPremium} >
            <Box>
              <Text fontWeight="500" fontSize="2xl" color={'rgba(177, 89, 99, 1)'} >
                Premium
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  30
                </Text>
                <Text fontSize="3xl" color="gray.500">
                  /month
                </Text>
              </HStack>

            </Box>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}
            
            maxW={{
              base : '250px',
              lg : '100%'
            }}
            >
            <List width={'100%'} spacing={3} textAlign="start" px={12}  >
              <ListItem minW={250} >
                <ListIcon as={FaCheckCircle} color="green.500" />
                includes everything from Standard Project
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                upto 50 Projects
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                500mb/project file storage
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button w="full" colorScheme="purple" variant="outline" onClick={()=>{
                props.onClick('Premium')
              }}  >
                Start
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>
      </Stack>
    </Box>
  )
}
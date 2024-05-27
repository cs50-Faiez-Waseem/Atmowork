'use client'
import { ReactNode } from 'react'
import {
    Box,
    Container,
    SimpleGrid,
    Stack,
    Text,
    chakra,
    VisuallyHidden,
    useColorModeValue,
} from '@chakra-ui/react'
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
const Logo = () => {
    return (
        <img src="./logo_transparent.png" alt="logo" width={100} height={100} />
    )
}

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
            {children}
        </Text>
    )
}

export default function Footer() {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}>
            <Container as={Stack} maxW={'6xl'} py={10}>
                <SimpleGrid
                    templateColumns={{ sm: '1fr 1fr', md: '1fr 2fr 1fr 1fr' }}
                    spacing={8}>
                    <Stack spacing={6}>
                        <Box>
                            <Logo />
                        </Box>
                        <Text fontSize={'2xl'} fontWeight={'bold'} >AtmoWork</Text>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>About AtmoWork</ListHeader>
                        <Box as="a" href={'#'}>
                            Welcome to AtmoWork , Your All in one Project Management Tool . Replace all the hassel and focus more on your work.
                            Brings all your tasks, teammates,and tools together.
                        </Box>

                    </Stack>

                    <Stack align={'flex-start'}>
                        <ListHeader>Support</ListHeader>
                        <Box as="a" href={'#'}>
                            Help Center
                        </Box>
                        <Box as="a" href={'#'}>
                            Terms of Service
                        </Box>
                        <Box as="a" href={'#'}>
                            Legal
                        </Box>
                        <Box as="a" href={'#'}>
                            Privacy Policy
                        </Box>
                        <Box as="a" href={'#'}>
                            Status
                        </Box>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Features</ListHeader>
                        <Box as="a" href={'#kanban'}>
                            Kanban
                        </Box>
                        <Box as="a" href={'#MindMap'}>
                            MindMap
                        </Box>
                        <Box as="a" href={'#Meet'}>
                            Meet
                        </Box>
                        <Box as="a" href={'#Meet'}>
                            Team Collaboration
                        </Box>
                        <Box as="a" href={'#product'}>
                            Project Files
                        </Box>
                    </Stack>
                </SimpleGrid>
            </Container>
            <FooterBottom />
        </Box>
    )
}


const SocialButton = ({
    children,
    label,
    href,
}: {
    children: ReactNode
    label: string
    href: string
}) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}>
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    )
}

function FooterBottom() {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}>
            <Container
                as={Stack}
                maxW={'6xl'}
                py={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}>
                <Text>© {new Date().getFullYear().toString()} AtmoWork. All rights reserved</Text>
                <Stack direction={'row'} spacing={6}>
                    <SocialButton label={'Twitter'} href={'#'}>
                        <FaTwitter />
                    </SocialButton>
                    <SocialButton label={'YouTube'} href={'#'}>
                        <FaYoutube />
                    </SocialButton>
                    <SocialButton label={'Instagram'} href={'#'}>
                        <FaInstagram />
                    </SocialButton>
                </Stack>
            </Container>
        </Box>
    )
}
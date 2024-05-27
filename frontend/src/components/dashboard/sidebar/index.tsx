'use client'
import React from 'react'
import { Router, useRouter } from 'next/router'
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
  useToast
} from '@chakra-ui/react'
import {
  FiHome,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiActivity,
  FiCamera,
  FiLogOut
} from 'react-icons/fi'
import { BsFillKanbanFill } from 'react-icons/bs'

import { IconType } from 'react-icons'
import api from '@/utils/fetcher'
import useUser from '@/providers/userStore'
import { useCookies } from 'react-cookie'


interface LinkItemProps {
  name: string
  icon: IconType,
  link: string
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children: React.ReactNode
  link: string
}
interface SideBarProps {
  children: React.ReactNode
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, link: '/dashboard/home' },
  { name: 'Spaces', icon: FiActivity, link: '/dashboard/spaces' },
  { name: 'Notifications', icon: FiBell, link: '/dashboard/notification' },
  { name: 'MindMap', icon: FiCompass, link: '/dashboard/mindmap' },
  { name: 'Goals', icon: FiStar, link: '/dashboard/goals' },
  { name: 'meet', icon: FiCamera, link: '/dashboard/meet' },
  { name: 'setting', icon: FiSettings, link: '/dashboard/setting' },
  { name: 'logout', icon: FiLogOut, link: '/dashboard/logout' },
]

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src='../logo_transparent.png' width={20} ></Image>
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          AtmoWork
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ icon, children, link, ...rest }: NavItemProps) => {
  const router = useRouter()
  return (
    <Box
      as="a"
      href={link}
      onClick={(e) => {
        e.preventDefault();
        router.push(link)
      }}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="2"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={router.pathname === link && 'purple.400'}
        color={router.pathname === link && 'white'}
        _hover={{
          bg: 'purple',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  //@ts-ignore
  const setUser = useUser((state) => state?.setUser)
  //@ts-ignore
  const user = useUser((state) => state?.users)

  const router = useRouter()

  const toast = useToast()

  const [,setCookie] = useCookies()

  React.useEffect(() => {
    console.log(user)
    if (isEmptyObject(user)) {
      api.get('/api/user/')
        .then(res => {
          if (res.data.status) {
            console.log(res.data)
            setUser({...res.data , ...res.data.user })
          } else {
            router.replace('/')
            toast({
              title: 'Error ',
              description: res.data?.message,
              duration: 6000,
              position: 'top',
              status: 'error'
            })
          }
        })
        .catch((err) => {
          if (err.response.data) {
            if (!err.response.data.status) {
              router.replace('/')
              toast({
                title: 'Error ',
                description: err.response.data?.message,
                duration: 6000,
                position: 'top',
                status: 'error'
              })
              setCookie('token','')
            }
          }
          console.log('err', err)
        })
    } else if (user.membership_plan_id === undefined) {
      console.log(user)
      toast({
        title: 'Payment Plan Not Purchased | Freemium Account',
        description: 'Need To Purchase a Plan',
        duration: 6000,
        position: 'top',
        status: 'error'
      })
    }
  }, [])

  const isEmptyObject = (obj) => {
    return obj ? Object.keys(obj).length === 0 : true;
  };
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        AtmoWork
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                   user?.profile_pic?.includes('localhost')? user?.profile_pic : process.env.NEXT_PUBLIC_backendURL + '/' +  user?.profile_pic
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{user?.username}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user?.account_membership}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem>Profile</MenuItem>
              <MenuDivider />
              <MenuItem  onClick={()=>{
                router.replace('/dashboard/logout')
              }}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

const SideBar = ({ children }: SideBarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} minH={'85vh'} bg={'white'} >
        {children}
      </Box>
    </Box>
  )
}

export default SideBar;
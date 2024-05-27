import { Stack, HStack } from '@chakra-ui/react'
import SideBar from '@/components/dashboard/sidebar/index'
import Card from '@/components/dashboard/card/Card'
import TopProjects from '@/components/dashboard/project/TopProject'
import useUser from '@/providers/userStore'
export default function Home() {
     //@ts-ignore
  const user = useUser((state) => state?.users)

  console.log(user)
   return <Stack>
      <SideBar>
         <HStack padding={2} justify={'center'} flexWrap={{base : 'wrap', lg : 'nowrap'}} >
            <Card title='Projects' value={user?.total_projects} color='app.btnPurple' />
            <Card title='Teams' value='0' color='red' />
            <Card title='Goals' value={user?.total_goals} color='teal' />
            <Card title='MindMaps' value='0' color='blue' />
         </HStack>
         <HStack p={2} width={'100%'} flexWrap={'wrap'} justify={'space-evenly'} >
            <TopProjects title={'New Projects'} list={user?.latestProjects ?? []} />
            <TopProjects title={'New Goals'} list={user?.latestGoals ?? []} />
            <TopProjects title={'New MindMaps'} list={[]} />
            <TopProjects title={'Teams'} list={[]} />
         </HStack>
      </SideBar>
   </Stack>
}
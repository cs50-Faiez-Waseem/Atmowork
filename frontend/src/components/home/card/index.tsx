import { Card, CardBody, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { BsFolder2 } from "react-icons/bs";

interface CardAboutProps {
    title : string,
    description : string,
    cardBg? : string,
    iconColor? : string
}

export default function CardAbout({ title , description , cardBg = 'pink.300' , iconColor = 'pink'} : CardAboutProps){
    return <Card
        width={useBreakpointValue({ base: 280, xsm : 200 , md: 350, lg: 400 })}
        margin={10} >
        <CardBody padding={0} paddingBottom={8} >

            <Stack bg={cardBg} h={'80px'} borderTopRadius={10} ></Stack>
            <Card pos="absolute" top={65} left={5} >
                <CardBody padding={2} >
                    <BsFolder2 size={32} color={iconColor} />
                </CardBody>
            </Card>
            <Text marginLeft={5} marginTop={10} fontSize={26} fontWeight={'bold'} >{title}</Text>
            <Text marginLeft={5} fontSize={20} color={'gray.600'} >{description}</Text>
        </CardBody>
    </Card>
}
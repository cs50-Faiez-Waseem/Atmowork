
import z from 'zod'
import api from "@/utils/fetcher"
import { useDisclosure, Input, Text, FormLabel, Button, Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, ModalCloseButton, ModalFooter, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useParams } from 'next/navigation'

const MemberMailSchema = z.object({
    email: z
        .string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email.")
})

export default function AddMemberModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [memberEmail, setMemberEmail] = useState('')

    const toast = useToast()


    const params = useParams()

    const addMember = async () => {
        try {
            if(memberEmail.length === 0){
                toast({
                    title: 'Invalid field',
                    description: 'Please Enter Email Address',
                    status: 'error',
                    duration: 5000,
                    position : 'top-right'
                })
                return;
            }

            console.log(params)

            const values = MemberMailSchema.safeParse({ email: memberEmail })

            if (!values.success) {
                toast({
                    title: 'Invalid field',
                    description: 'Invalid Email Address',
                    status: 'error',
                    duration: 5000,
                    position : 'top-right'
                })
                onClose()
                return;
            }

            const { data : { email } } = values

            
           const response = await api.post(`/api/user/project/${params.id}/invite`, {
            email
           })

           const { status ,  message } = response.data

           if(status){
               toast({
                   title: 'Invite Sucess',
                   description: message,
                   status: 'success',
                   duration: 5000,
                   position : 'top-right'
               })
            }else{
                toast({
                    title: 'Failed To Invite',
                    description: message,
                    status: 'error',
                    duration: 5000,
                    position : 'top-right'
                })
            }
            
           setMemberEmail('')
           onClose()

        } catch (error) {
            toast({
                title: 'Some Error Occured',
                description: error.message,
                status: 'error',
                duration: 5000,
                position : 'top-right'
            })
        }
    }

    return (
        <>
            <Button onClick={onOpen} maxW={'150px'} >Add Member</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Member</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormLabel>Email :</FormLabel>
                        <Input placeholder="jhon.doe@example.com" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} />
                        <Text color={'GrayText'} size={'xs'} mt={1}>Note* : Please provide a Valid Email to add as Member</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='outline' onClick={addMember} >Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
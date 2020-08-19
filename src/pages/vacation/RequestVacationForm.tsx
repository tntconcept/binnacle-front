import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure
} from '@chakra-ui/core'
import { DatePicker } from 'pages/vacation/DatePicker/DatePicker'
import React from 'react'

export const RequestVacationForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Flex align="center">
        <Heading>Vacaciones</Heading>
        <Button onClick={onOpen}>Solicitar Vacaciones</Button>
      </Flex>
      <Modal
        onClose={onClose}
        size="xl"
        isOpen={isOpen}
        closeOnEsc={false}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Nuevo periodo de vacaciones</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <DatePicker currentDate={new Date()} />
              <FormControl id="comments">
                <FormLabel>Comentario</FormLabel>
                <Textarea
                  placeholder="Here is a sample placeholder"
                  resize="none" />
              </FormControl>

              <FormControl id="charge-year">
                <FormLabel>Charge year</FormLabel>
                <Select
                  placeholder="Select option"
                  defaultValue="option3">
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}

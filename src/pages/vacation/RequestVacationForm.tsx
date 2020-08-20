import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea
} from '@chakra-ui/core'
import { DatePicker } from 'pages/vacation/DatePicker/DatePicker'
import React from 'react'
import { Field, Formik } from 'formik'
import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'

interface Props {
  initialValues: any
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const RequestVacationForm: React.FC<Props> = ({
  isOpen,
  initialValues,
  onOpen,
  onClose
}) => {
  return (
    <>
      <Flex align="center" justify="space-between">
        <Heading>Vacaciones</Heading>
        <Button onClick={onOpen} size="md">
          Solicitar Vacaciones
        </Button>
      </Flex>
      <Modal onClose={onClose} size="xl" isOpen={isOpen} closeOnEsc={false}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Nuevo periodo de vacaciones</ModalHeader>
            <ModalCloseButton />
            <Formik
              initialValues={initialValues}
              onSubmit={async (values, actions) => {
                const vacation = {
                  id: undefined,
                  userComment: values.description,
                  beginDate: values.period.split(' - ')[0],
                  finalDate: values.period.split(' - ')[1],
                  chargeYear: values.chargeYear
                }
                const response = await HttpClient.post(endpoints.holidays, {
                  json: vacation
                }).json()

                console.log('post response', response)
              }}
            >
              {(formik) => (
                <>
                  <ModalBody>
                    <form>
                      <Field name="period">
                        {(props: any) => (
                          <DatePicker
                            currentDate={new Date()}
                            onChange={(value: string) => {
                              props.form.setFieldValue('period', value)
                            }}
                          >
                            {(value) => (
                              <FormControl
                                id="comments"
                                isReadOnly
                                onClick={value.onOpenDatePicker}
                                isInvalid={props.meta.error && props.meta.touched}
                              >
                                <FormLabel htmlFor="period">
                                  Periodo de vacaciones
                                </FormLabel>
                                <Input
                                  id="period"
                                  value={props.field.value}
                                  name={props.field.name}
                                  onBlur={props.field.onBlur}
                                />
                                <FormErrorMessage>
                                  {props.meta.error}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </DatePicker>
                        )}
                      </Field>
                      <Field name="description">
                        {(props: any) => (
                          <FormControl
                            isInvalid={props.meta.error && props.meta.touched}
                          >
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <Textarea
                              {...props.field}
                              id="description"
                              placeholder="Write a description"
                              resize="none"
                            />
                            <FormErrorMessage>{props.meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="chargeYear">
                        {(props: any) => (
                          <FormControl
                            isInvalid={props.meta.error && props.meta.touched}
                          >
                            <FormLabel htmlFor="charge-year">Charge year</FormLabel>
                            <Select
                              {...props.field}
                              id="charge-year"
                              placeholder="Select option"
                            >
                              <option value="option1">Option 1</option>
                              <option value="option2">Option 2</option>
                              <option value="option3">Option 3</option>
                            </Select>
                            <FormErrorMessage>{props.meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <pre>{JSON.stringify(formik.values, null, 2)}</pre>
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      mt={4}
                      colorScheme="teal"
                      isLoading={formik.isSubmitting}
                      onClick={formik.handleSubmit}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </>
              )}
            </Formik>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}

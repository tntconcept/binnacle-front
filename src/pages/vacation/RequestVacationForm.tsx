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
// @ts-ignore
import React, { unstable_useTransition as useTransition } from 'react'
import { Field, Formik } from 'formik'
import { SUSPENSE_CONFIG } from 'utils/constants'
import { parse } from 'date-fns'

interface Props {
  initialValues: RequestVacationFormValues
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onSubmit: () => void
}

export interface RequestVacationFormValues {
  id?: number
  period: string
  description: string
  chargeYear: string
}

export const RequestVacationForm: React.FC<Props> = ({
  isOpen,
  initialValues,
  onOpen,
  onClose,
  onSubmit
}) => {
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)

  const handleSubmit = async (values: RequestVacationFormValues) => {
    const editMode = initialValues.id !== undefined

    const vacation = {
      id: initialValues.id,
      userComment: values.description,
      beginDate: values.period.split(' - ')[0],
      finalDate: values.period.split(' - ')[1],
      chargeYear: values.chargeYear
    }

    // if (editMode) {
    //   await HttpClient.put(endpoints.holidays, {
    //     json: vacation
    //   }).json()
    // } else {
    //   await HttpClient.post(endpoints.holidays, {
    //     json: vacation
    //   }).json()
    // }

    startTransition(() => {
      onSubmit()
      onClose()
    })
  }

  const initialSelectedDates =
    !initialValues.id !== undefined
      ? undefined
      : {
        startDate: parse(
          initialValues.period.split(' - ')[0],
          'dd/MM/yyyy',
          new Date()
        ),
        endDate: parse(
          initialValues.period.split(' - ')[1],
          'dd/MM/yyyy',
          new Date()
        )
      }

  return (
    <>
      <Flex
        align="center"
        justify="space-between">
        <Heading>Vacaciones</Heading>
        <Button
          onClick={onOpen}
          size="md">
          Solicitar Vacaciones
        </Button>
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
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}>
              {(formik) => (
                <>
                  <ModalBody>
                    <form>
                      <Field name="period">
                        {(props: any) => (
                          <DatePicker
                            initialSelectedDate={initialSelectedDates}
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
                      isLoading={formik.isSubmitting || isPending}
                      onClick={formik.handleSubmit}
                    >
                      Send
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

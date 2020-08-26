import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { addYears, parse, subYears } from 'date-fns'
import { FormValues } from './VacationPage'
import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'


const chargeYears = [
  subYears(new Date(), 1).getFullYear(),
  new Date().getFullYear(),
  addYears(new Date(), 1).getFullYear()
]

interface Props {
  initialValues: FormValues
  isOpen: boolean
  onClose: () => void
  onRefreshHolidays: () => void
  createVacationPeriod?: (data: any) => Promise<void>
  updateVacationPeriod?: (data: any) => Promise<void>
}

export const RequestVacationForm: React.FC<Props> = (props) => {
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)

  const handleSubmit = async (values: FormValues) => {
    const shouldSendUpdateRequest = values.id !== undefined

    const data = {
      id: values.id,
      userComment: values.description,
      beginDate: values.period.split(' - ')[0],
      finalDate: values.period.split(' - ')[1],
      chargeYear: values.chargeYear
    }

    if (shouldSendUpdateRequest) {
      await props.updateVacationPeriod!(data)
    } else {
      await props.createVacationPeriod!(data)
    }

    startTransition(() => {
      props.onRefreshHolidays()
      props.onClose()
    })

    // props.onRefreshHolidays()
    // props.onClose()
  }

  const initialSelectedDates =
    !props.initialValues.id !== undefined
      ? undefined
      : {
        startDate: parse(
          props.initialValues.period.split(' - ')[0],
          'dd/MM/yyyy',
          new Date()
        ),
        endDate: parse(
          props.initialValues.period.split(' - ')[1],
          'dd/MM/yyyy',
          new Date()
        )
      }

  return (
    <Modal
      onClose={props.onClose}
      size="xl"
      isOpen={props.isOpen}
      closeOnEsc={false}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Nuevo periodo de vacaciones</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={props.initialValues}
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
                          >
                            {chargeYears.map(year => <option key={year} value={year}>{year}</option>)}
                          </Select>
                          <FormErrorMessage>{props.meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
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
  )
}

async function updateVacationPeriod(data: any) {
  await HttpClient.put(endpoints.holidays, {
    json: data
  }).json()
}

async function createVacationPeriod(data: any) {
  await HttpClient.post(endpoints.holidays, {
    json: data
  }).json()
}

RequestVacationForm.defaultProps = {
  updateVacationPeriod,
  createVacationPeriod
}

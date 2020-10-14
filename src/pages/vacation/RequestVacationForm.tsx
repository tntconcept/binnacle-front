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
  Text,
  Textarea,
  VStack
} from '@chakra-ui/core'
// @ts-ignore
import React, {
  Suspense,
  unstable_useTransition as useTransition,
  useEffect,
  useRef
} from 'react'
import { Field, FieldProps, Formik } from 'formik'
import { SUSPENSE_CONFIG } from 'utils/constants'
import { FormValues } from './VacationPage'
import { useTranslation } from 'react-i18next'
import createVacationPeriod from 'api/vacation/createVacationPeriod'
import updateVacationPeriod from 'api/vacation/updateVacationPeriod'
import * as Yup from 'yup'
import dayjs, { DATE_FORMAT } from 'services/dayjs'
import HttpClient from 'services/HttpClient'
import { useAsyncResource } from 'use-async-resource'
import { CreatePrivateHolidayResponse } from 'api/vacation/vacation.interfaces'

export async function fetchCorrespondingPrivateHolidayDays(
  startDate: ISO8601Date,
  endDate: ISO8601Date
): Promise<Number> {
  const response = await HttpClient.get('api/private-holidays/days', {
    searchParams: {
      startDate: startDate,
      endDate: endDate
    }
  }).json<number>()

  return response
}

const CorrespondingDays: React.FC<{
  startDate: ISO8601Date
  endDate: ISO8601Date
}> = (props) => {
  const [days] = useAsyncResource(
    fetchCorrespondingPrivateHolidayDays,
    props.startDate,
    props.endDate
  )

  return <Text fontSize="md">Corresponden {days()} días</Text>
}

interface Props {
  initialValues: FormValues
  isOpen: boolean
  onClose: (period?: CreatePrivateHolidayResponse[]) => void
  onRefreshHolidays: () => void
  createVacationPeriod?: typeof createVacationPeriod
  updateVacationPeriod?: typeof updateVacationPeriod
}

export const RequestVacationForm: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)

  // I moved this inside the component because outside the Date object was not mocked by Cypress...
  const schema = useRef(
    Yup.object().shape<
      Omit<FormValues, 'startDate' | 'endDate'> & {
        startDate: Date
        endDate: Date
      }
    >({
      startDate: Yup.date()
        .max(
          dayjs()
            .add(1, 'year')
            .endOf('year')
            .toDate(),
          t('form_errors.year_max') +
            ' ' +
            dayjs()
              .add(2, 'year')
              .year()
        )
        .required(t('form_errors.field_required'))
        .defined(),
      endDate: Yup.date()
        .max(
          dayjs()
            .add(1, 'year')
            .endOf('year')
            .toDate(),
          t('form_errors.year_max') +
            ' ' +
            dayjs()
              .add(2, 'year')
              .year()
        )
        .required(t('form_errors.field_required'))
        .test('is-greater', t('form_errors.end_date_greater'), function(value) {
          const { startDate, endDate } = this.parent
          return dayjs(endDate).isSameOrAfter(startDate, 'day')
        })
        .defined(),
      description: Yup.string()
        .default('')
        .defined()
        .max(
          1024,
          (message) =>
            `${t('form_errors.max_length')} ${message.value.length} / ${message.max}`
        )
    })
  )

  const handleSubmit = async (values: FormValues) => {
    const shouldSendUpdateRequest = values.id !== undefined

    const newData = {
      id: values.id,
      description: values.description.trim().length > 0 ? values.description : null!,
      startDate: dayjs(values.startDate).toISOString(),
      endDate: dayjs(values.endDate).toISOString()
    }

    let response: CreatePrivateHolidayResponse[]

    if (shouldSendUpdateRequest) {
      response = await props.updateVacationPeriod!(newData)
    } else {
      response = await props.createVacationPeriod!(newData)
    }

    startTransition(() => {
      props.onRefreshHolidays()
      props.onClose(response)
    })
  }

  return (
    <Modal
      onClose={props.onClose}
      size="xl"
      isOpen={props.isOpen}
      closeOnEsc={false}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>{t('vacation_form.form_header')}</ModalHeader>
          <ModalCloseButton aria-label={t('actions.close')} />
          <Formik
            initialValues={props.initialValues}
            validationSchema={schema.current}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <>
                <ModalBody>
                  <VStack as="form" spacing={1} align="start">
                    <Field name="startDate">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          id="startDate"
                          isInvalid={meta.error && meta.touched}
                        >
                          <FormLabel>{t('vacation_form.start_date')}</FormLabel>
                          <Input
                            type="date"
                            {...field}
                            value={field.value}
                            max={dayjs()
                              .add(1, 'year')
                              .endOf('year')
                              .format(DATE_FORMAT)}
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="endDate">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          id="endDate"
                          isInvalid={meta.error && meta.touched}
                        >
                          <FormLabel>{t('vacation_form.end_date')}</FormLabel>
                          <Input
                            type="date"
                            {...field}
                            value={field.value}
                            max={dayjs()
                              .add(1, 'year')
                              .endOf('year')
                              .format(DATE_FORMAT)}
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Suspense fallback={<p>Loading days</p>}>
                      {formik.values.startDate && formik.values.endDate && (
                        <CorrespondingDays
                          startDate={formik.values.startDate}
                          endDate={formik.values.endDate}
                        />
                      )}
                    </Suspense>
                    <Field name="description">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          id="description"
                          isInvalid={meta.error && meta.touched}
                        >
                          <FormLabel>{t('vacation_form.description')}</FormLabel>
                          <Textarea resize="none" {...field} />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    mt={4}
                    colorScheme="blue"
                    isLoading={
                      (!formik.isValidating && formik.isSubmitting) || isPending
                    }
                    onClick={formik.handleSubmit}
                  >
                    {t('actions.save')}
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

RequestVacationForm.defaultProps = {
  updateVacationPeriod,
  createVacationPeriod
}

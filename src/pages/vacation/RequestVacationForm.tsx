// @ts-ignore
// prettier-ignore
import React, { unstable_useTransition as useTransition, useEffect, useRef, useState } from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/core'
import { Field, FieldProps, Formik } from 'formik'
import { SUSPENSE_CONFIG } from 'core/utils/constants'
import { FormValues } from './VacationPage'
import { useTranslation } from 'react-i18next'
import {
  updateVacationPeriod,
  createVacationPeriod,
  fetchCorrespondingPrivateHolidayDays
} from 'core/api/vacations'
import * as Yup from 'yup'
import { CreateVacationPeriodResponse } from 'core/api/vacation.interfaces'
import { useShowErrorNotification } from 'core/components/Notifications/useShowErrorNotification'
import i18n from 'core/i18n/i18n'
import chrono from 'core/services/Chrono'
import { FloatingLabelInput } from 'core/components/FloatingLabelInput'
import { FloatingLabelTextarea } from 'core/components/FloatingLabelTextarea'
import { useDebounce } from 'core/hooks'

const WorkingDays: React.FC<{
  startDate: ISO8601Date
  endDate: ISO8601Date
}> = (props) => {
  const { t } = useTranslation()
  const [daysQt, setDaysQt] = useState<null | number>(null)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedStartDate = useDebounce(props.startDate, 500)
  const debouncedEndDate = useDebounce(props.endDate, 500)

  useEffect(() => {
    let isCancelled = false
    if (debouncedStartDate && debouncedEndDate) {
      setIsLoading(true)
      fetchCorrespondingPrivateHolidayDays(debouncedStartDate, debouncedEndDate).then((days) => {
        if (!isCancelled) {
          setIsLoading(false)
          setDaysQt(days)
        }
      })
    } else {
      setDaysQt(null)
    }

    return () => {
      isCancelled = true
    }
  }, [debouncedStartDate, debouncedEndDate])

  if (isLoading) {
    return <span>{t('accessibility.loading')}</span>
  }

  return <span data-testid="working_days">{daysQt}</span>
}

interface Props {
  initialValues: FormValues
  isOpen: boolean
  onClose: (period?: CreateVacationPeriodResponse[]) => void
  onRefreshHolidays: () => void
  createVacationPeriod?: typeof createVacationPeriod
  updateVacationPeriod?: typeof updateVacationPeriod
}

export const RequestVacationForm: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const showErrorNotification = useShowErrorNotification()

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
          chrono()
            .plus(1, 'year')
            .endOf('year')
            .getDate(),
          t('form_errors.year_max') +
            ' ' +
            chrono()
              .plus(2, 'year')
              .get('year')
        )
        .required(t('form_errors.field_required'))
        .defined(),
      endDate: Yup.date()
        .max(
          chrono()
            .plus(1, 'year')
            .endOf('year')
            .getDate(),
          t('form_errors.year_max') +
            ' ' +
            chrono()
              .plus(2, 'year')
              .get('year')
        )
        .required(t('form_errors.field_required'))
        .test('is-greater', t('form_errors.end_date_greater'), function(value) {
          const { startDate, endDate } = this.parent
          return chrono(endDate).isSame(startDate, 'day') || chrono(endDate).isAfter(startDate)
        })
        .defined(),
      description: Yup.string()
        .default('')
        .defined()
        .max(
          1024,
          (message) => `${t('form_errors.max_length')} ${message.value.length} / ${message.max}`
        )
    })
  )

  const handleSubmit = async (values: FormValues) => {
    try {
      const shouldSendUpdateRequest = values.id !== undefined

      const newData = {
        id: values.id,
        description: values.description.trim().length > 0 ? values.description : null!,
        startDate: chrono(values.startDate).toISOString(),
        endDate: chrono(values.endDate).toISOString()
      }
      let response: CreateVacationPeriodResponse[]

      if (shouldSendUpdateRequest) {
        response = await props.updateVacationPeriod!(newData)
      } else {
        response = await props.createVacationPeriod!(newData)
      }

      startTransition(() => {
        props.onRefreshHolidays()
        props.onClose(response)
      })
    } catch (error) {
      const vacationMessage = await getVacationErrorMessage(error.response)
      showErrorNotification(error, vacationMessage)
    }

    async function getVacationErrorMessage(response: Response) {
      let message = undefined
      if (response.status === 400) {
        const body = await response.json()
        if (body.code === 'INVALID_NEXT_YEAR_VACATION_DAYS_REQUEST') {
          message = {
            400: {
              title: i18n.t('vacation.error_max_vacation_days_requested_next_year_title'),
              description: i18n.t('vacation.error_max_vacation_days_requested_next_year_message')
            }
          }
        }
      }
      return message
    }
  }

  const labelBgColor = useColorModeValue('white', 'gray.700')

  return (
    <Modal onClose={props.onClose} size="xl" isOpen={props.isOpen} closeOnEsc={true}>
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
                  <VStack as="form" spacing={5} align="start">
                    <Field name="startDate">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          id="startDate"
                          isInvalid={meta.error !== undefined && meta.touched}
                        >
                          <FloatingLabelInput
                            label={t('vacation_form.start_date')}
                            labelBgColor={labelBgColor}
                            type="date"
                            {...field}
                            value={field.value}
                            max={chrono()
                              .plus(1, 'year')
                              .endOf('year')
                              .format(chrono.DATE_FORMAT)}
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="endDate">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          id="endDate"
                          isInvalid={meta.error !== undefined && meta.touched}
                        >
                          <FloatingLabelInput
                            label={t('vacation_form.end_date')}
                            labelBgColor={labelBgColor}
                            type="date"
                            {...field}
                            value={field.value}
                            max={chrono()
                              .plus(1, 'year')
                              .endOf('year')
                              .format(chrono.DATE_FORMAT)}
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Text mb="0.3rem">
                      {t('vacation_form.working_days') + ': '}
                      {formik.values.startDate && formik.values.endDate ? (
                        <WorkingDays
                          startDate={formik.values.startDate}
                          endDate={formik.values.endDate}
                        />
                      ) : (
                        '-'
                      )}
                    </Text>
                    <Field name="description">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          id="description"
                          isInvalid={meta.error !== undefined && meta.touched}
                        >
                          <FloatingLabelTextarea
                            label={t('vacation_form.description')}
                            labelBgColor={labelBgColor}
                            {...field}
                            height="128px"
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    mt={4}
                    colorScheme="brand"
                    isLoading={(!formik.isValidating && formik.isSubmitting) || isPending}
                    onClick={formik.handleSubmit as any}
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

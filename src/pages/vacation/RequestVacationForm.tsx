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
// @ts-ignore
import React, { unstable_useTransition as useTransition, useRef } from 'react'
import { Field, FieldProps, Formik } from 'formik'
import { SUSPENSE_CONFIG } from 'utils/constants'
import {
  addYears,
  endOfYear,
  format,
  isDate,
  isSameDay,
  lastDayOfYear,
  lightFormat,
  subDays,
  subYears
} from 'date-fns'
import { FormValues } from './VacationPage'
import { useTranslation } from 'react-i18next'
import createVacationPeriod from 'api/vacation/createVacationPeriod'
import updateVacationPeriod from 'api/vacation/updateVacationPeriod'
import * as Yup from 'yup'
import { isAfter } from 'date-fns'

interface Props {
  initialValues: FormValues
  isOpen: boolean
  onClose: () => void
  onRefreshHolidays: (year: number) => void
  createVacationPeriod?: (data: any) => Promise<void>
  updateVacationPeriod?: (data: any) => Promise<void>
}

export const RequestVacationForm: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)

  // I moved this inside the component because outside the Date object was not mocked by Cypress...
  const schema = useRef(
    Yup.object().shape<FormValues>({
      startDate: Yup.date()
        .min(subDays(new Date(), 1), t('form_errors.date_min_today'))
        .max(
          lastDayOfYear(addYears(new Date(), 1)),
          t('form_errors.year_max') + ' ' + addYears(new Date(), 2).getFullYear()
        )
        .required(t('form_errors.field_required'))
        .defined(),
      endDate: Yup.date()
        .min(subDays(new Date(), 1), t('form_errors.date_min_today'))
        .max(
          lastDayOfYear(addYears(new Date(), 1)),
          t('form_errors.year_max') + ' ' + addYears(new Date(), 2).getFullYear()
        )
        .required(t('form_errors.field_required'))
        .test('is-greater', t('form_errors.end_date_greater'), function(value) {
          const { startDate, endDate } = this.parent
          return isAfter(endDate, startDate) || isSameDay(endDate, startDate)
        })
        .defined(),
      description: Yup.string()
        .default('')
        .defined()
        .max(
          1024,
          (message) =>
            `${t('form_errors.max_length')} ${message.value.length} / ${message.max}`
        ),
      chargeYear: Yup.date()
        .required(t('form_errors.field_required'))
        .defined()
    })
  )

  const chargeYears = useRef([
    subYears(new Date(), 1).getFullYear(),
    new Date().getFullYear()
  ])

  const handleSubmit = async (values: FormValues) => {
    const shouldSendUpdateRequest = values.id !== undefined

    const data = {
      id: values.id,
      userComment: values.description,
      beginDate: formatDate(values.startDate),
      finalDate: formatDate(values.endDate),
      chargeYear: ((values.chargeYear as unknown) as string) + '-01-01'
    }

    if (shouldSendUpdateRequest) {
      await props.updateVacationPeriod!(data)
    } else {
      await props.createVacationPeriod!(data)
    }

    startTransition(() => {
      props.onRefreshHolidays((values.chargeYear as unknown) as number)
      props.onClose()
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
            initialValues={{
              ...props.initialValues,
              chargeYear: props.initialValues.chargeYear.getUTCFullYear() as any
            }}
            validationSchema={schema.current}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <>
                <ModalBody>
                  <form>
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
                            value={formatDate(field.value)}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            max={lightFormat(
                              endOfYear(addYears(new Date(), 1)),
                              'yyyy-MM-dd'
                            )}
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
                            value={formatDate(field.value)}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            max={format(
                              endOfYear(addYears(new Date(), 1)),
                              'yyyy-MM-dd'
                            )}
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
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
                    <Field name="chargeYear">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          id="charge-year"
                          isInvalid={meta.error && meta.touched}
                        >
                          <FormLabel>{t('vacation_form.charge_year')}</FormLabel>
                          <Select {...field}>
                            {chargeYears.current.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </form>
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

function formatDate(value: string | Date | undefined) {
  if (value) {
    if (typeof value === 'string' || value instanceof String) {
      return value
    } else {
      if (isDate(value)) {
        return lightFormat(value as Date, 'yyyy-MM-dd')
      } else {
        return value
      }
    }
  }

  return ''
}

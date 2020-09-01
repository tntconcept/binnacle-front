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
import { DatePicker } from 'pages/vacation/RequestVacationForm/DatePicker/DatePicker'
// @ts-ignore
import React, { unstable_useTransition as useTransition } from 'react'
import { Field, Formik } from 'formik'
import { SUSPENSE_CONFIG } from 'utils/constants'
import { addYears, parse, subYears } from 'date-fns'
import { FormValues } from '../VacationPage'
import { useTranslation } from 'react-i18next'
import createVacationPeriod from 'api/vacation/createVacationPeriod'
import updateVacationPeriod from 'api/vacation/updateVacationPeriod'
import * as Yup from 'yup'
import i18n from 'app/i18n'

const chargeYears = [
  subYears(new Date(), 1).getFullYear(),
  new Date().getFullYear(),
  addYears(new Date(), 1).getFullYear()
]

const schema = Yup.object().shape<FormValues>({
  period: Yup.string()
    .required(i18n.t('form_errors.field_required'))
    .defined(),
  description: Yup.string()
    .default('')
    .defined()
    .max(
      1024,
      (message) =>
        `${i18n.t('form_errors.max_length')} ${message.value.length} / ${
          message.max
        }`
    ),
  chargeYear: Yup.string().required(i18n.t('form_errors.field_required'))
})

interface Props {
  initialValues: FormValues
  isOpen: boolean
  onClose: () => void
  onRefreshHolidays: () => void
  createVacationPeriod?: (data: any) => Promise<void>
  updateVacationPeriod?: (data: any) => Promise<void>
}

export const RequestVacationForm: React.FC<Props> = (props) => {
  const { t } = useTranslation()
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
      closeOnEsc={false}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>{t('vacation_form.form_header')}</ModalHeader>
          <ModalCloseButton aria-label={t('actions.close')} />
          <Formik
            initialValues={props.initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
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
                                {t('vacation_form.vacation_period')}
                              </FormLabel>
                              <Input
                                id="period"
                                value={props.field.value}
                                name={props.field.name}
                                onBlur={props.field.onBlur}
                              />
                              <FormErrorMessage>{props.meta.error}</FormErrorMessage>
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
                          <FormLabel htmlFor="description">
                            {t('vacation_form.description')}
                          </FormLabel>
                          <Textarea
                            {...props.field}
                            id="description"
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
                          <FormLabel htmlFor="charge-year">
                            {t('vacation_form.charge_year')}
                          </FormLabel>
                          <Select {...props.field} id="charge-year">
                            {chargeYears.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
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

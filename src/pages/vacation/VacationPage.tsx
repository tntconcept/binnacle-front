// @ts-ignore
// prettier-ignore
import React, { Suspense, useState, unstable_SuspenseList as SuspenseList } from 'react'
import {
  Flex,
  Skeleton,
  SkeletonText,
  Stack,
  Button,
  Heading,
  useDisclosure
} from '@chakra-ui/core'
import { RequestVacationForm } from 'pages/vacation/RequestVacationForm'
import { useAsyncResource } from 'use-async-resource'
import { resourceCache } from 'use-async-resource/lib'
import { VacationTable } from './VacationTable/VacationTable'
import { VacationInformation } from './VacationInformation'
import { SelectYear } from './SelectYear'
import { IPrivateHoliday } from 'api/interfaces/IHolidays'
import { useTranslation } from 'react-i18next'
import fetchLoggedUser from 'api/user/fetchLoggedUser'
import startOfYear from 'date-fns/startOfYear'
import endOfYear from 'date-fns/endOfYear'
import { fetchHolidaysByChargeYear } from 'api/vacation/fetchHolidaysByChargeYear'
import { formatDateForQuery } from 'utils/DateUtils'

const startDate = startOfYear(new Date())
const endDate = endOfYear(new Date())

const initialValues = {
  startDate: formatDateForQuery(startDate),
  endDate: formatDateForQuery(endDate),
  chargeYear: formatDateForQuery(startDate)
}

export interface FormValues {
  id?: number
  startDate?: Date
  endDate?: Date
  description: string
  chargeYear: Date
}

export function VacationPage() {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [initialFormValues, setInitialFormValues] = useState<FormValues>({
    id: undefined,
    startDate: undefined,
    endDate: undefined,
    description: '',
    chargeYear: new Date()
  })
  const [chargeYear, setChargeYear] = useState(new Date().getFullYear())

  const [holidaysReader, fetchHolidays] = useAsyncResource(
    fetchHolidaysByChargeYear,
    initialValues.startDate,
    initialValues.endDate,
    initialValues.chargeYear
  )
  const [userReader] = useAsyncResource(fetchLoggedUser, [])

  const refreshHolidays = (newYear: number) => {
    if (chargeYear == newYear) {
      resourceCache(fetchHolidaysByChargeYear).clear()
      fetchHolidays(`${newYear}-01-01`, `${newYear}-12-31`, `${newYear}-01-01`)
    }
  }

  const handleHolidayEdit = (holiday: IPrivateHoliday) => {
    setInitialFormValues({
      id: holiday.id,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      description: holiday.userComment || '',
      chargeYear: holiday.chargeYear
    })
    onOpen()
  }

  const handleClose = () => {
    setInitialFormValues({
      id: undefined,
      startDate: undefined,
      endDate: undefined,
      description: '',
      chargeYear: new Date()
    })
    onClose()
  }

  return (
    <Stack p="16px" spacing={4}>
      <Flex align="center" justify="space-between">
        <Heading>{t('vacation.title')}</Heading>
        <Button onClick={onOpen} size="md">
          {t('vacation_form.open_form_button')}
        </Button>
      </Flex>
      <RequestVacationForm
        isOpen={isOpen}
        onClose={handleClose}
        initialValues={initialFormValues}
        onRefreshHolidays={refreshHolidays}
      />
      <SuspenseList revealOrder="forwards">
        <Suspense fallback={<Skeleton height="32px" width="100px" />}>
          <SelectYear
            userReader={userReader}
            onRefreshHolidays={(newYear) => {
              resourceCache(fetchHolidaysByChargeYear).clear()
              fetchHolidays(
                `${newYear}-01-01`,
                `${newYear}-12-31`,
                `${newYear}-01-01`
              )
            }}
            onChangeYear={setChargeYear}
          />
        </Suspense>
        <Suspense fallback={<SkeletonText noOfLines={4} spacing="4" />}>
          <VacationInformation
            userReader={userReader}
            holidaysReader={holidaysReader}
            selectedYear={new Date(Date.UTC(chargeYear, 0, 1))}
          />
        </Suspense>
        <Suspense
          fallback={
            <Stack>
              <Skeleton height="35px" />
              <Skeleton height="30px" />
              <Skeleton height="30px" />
            </Stack>
          }
        >
          <VacationTable
            holidays={holidaysReader}
            onEdit={handleHolidayEdit}
            onRefreshHolidays={refreshHolidays}
          />
        </Suspense>
      </SuspenseList>
    </Stack>
  )
}

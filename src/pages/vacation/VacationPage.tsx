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
import { fetchHolidaysBetweenDate } from 'api/HolidaysAPI'
import { resourceCache } from 'use-async-resource/lib'
import { VacationTable } from './VacationTable/VacationTable'
import { VacationInformation } from './VacationInformation'
import { SelectYear } from './SelectYear'
import { IPrivateHoliday } from 'api/interfaces/IHolidays'
import { useTranslation } from 'react-i18next'
import fetchLoggedUser from 'api/user/fetchLoggedUser'
import startOfYear from 'date-fns/startOfYear'
import endOfYear from 'date-fns/endOfYear'
import { getYear } from 'date-fns'

const startDate = startOfYear(new Date())
const endDate = endOfYear(new Date())

const initialYear = getYear(startDate)

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

  const [holidaysReader, fetchHolidays] = useAsyncResource(
    fetchHolidaysBetweenDate,
    startDate,
    endDate
  )
  const [userReader] = useAsyncResource(fetchLoggedUser, [])

  const refreshHolidays = (newYear: number | undefined = initialYear) => {
    resourceCache(fetchHolidaysBetweenDate).clear()

    fetchHolidays(new Date(newYear, 0, 1), new Date(newYear, 11, 31))
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
        onClose={onClose}
        initialValues={initialFormValues}
        onRefreshHolidays={refreshHolidays}
      />
      <SuspenseList revealOrder="forwards">
        <Suspense fallback={<Skeleton height="32px" width="100px" />}>
          <SelectYear userReader={userReader} onRefreshHolidays={refreshHolidays} />
        </Suspense>
        <Suspense fallback={<SkeletonText noOfLines={4} spacing="4" />}>
          <VacationInformation
            userReader={userReader}
            holidaysReader={holidaysReader}
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

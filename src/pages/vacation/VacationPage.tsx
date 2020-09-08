// @ts-ignore
// prettier-ignore
import React, { Fragment, Suspense, unstable_SuspenseList as SuspenseList, useEffect, useState } from 'react'
import {
  Button,
  Flex,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
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
import { fetchHolidaysByChargeYear } from 'api/vacation/fetchHolidaysByChargeYear'
import dayjs, { DATE_FORMAT, Dayjs } from 'services/dayjs'
import Navbar from 'core/features/Navbar/Navbar'
import { useTitle } from 'core/hooks/useTitle'

const startDate = dayjs().startOf('year')
const endDate = dayjs().endOf('year')

const initialValues = {
  startDate: startDate.format(DATE_FORMAT),
  endDate: endDate.format(DATE_FORMAT),
  chargeYear: startDate.format(DATE_FORMAT)
}

export interface FormValues {
  id?: number
  description: string
  startDate?: ISO8601Date
  endDate?: ISO8601Date
  chargeYear: ISO8601Date
}

const initialFormState = {
  id: undefined,
  startDate: '',
  endDate: '',
  description: '',
  chargeYear: dayjs()
    .startOf('year')
    .format(DATE_FORMAT)
}

export function VacationPage() {
  const { t } = useTranslation()
  useTitle(t('pages.vacations'))
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [initialFormValues, setInitialFormValues] = useState<FormValues>(
    initialFormState
  )
  const [selectedChargeYear, setSelectedChargeYear] = useState(dayjs().year())

  const [holidaysReader, fetchHolidays] = useAsyncResource(
    fetchHolidaysByChargeYear,
    initialValues.startDate,
    initialValues.endDate,
    initialValues.chargeYear
  )
  const [userReader] = useAsyncResource(fetchLoggedUser, [])

  const fetchHolidaysByYear = (year: Dayjs) => {
    resourceCache(fetchHolidaysByChargeYear).clear()

    const startOfYear = year.startOf('year').format(DATE_FORMAT)
    const endOfYear = year.endOf('year').format(DATE_FORMAT)

    fetchHolidays(startOfYear, endOfYear, startOfYear)
  }

  const refreshHolidays = (year: number) => {
    const yearDate = dayjs().year(year)
    const chargeYearDate = dayjs().year(selectedChargeYear)

    if (dayjs(yearDate).isSame(chargeYearDate, 'year')) {
      fetchHolidaysByYear(yearDate)
    } else {
      fetchHolidaysByYear(chargeYearDate)
    }
  }

  const handleHolidayEdit = (holiday: IPrivateHoliday) => {
    setInitialFormValues({
      id: holiday.id,
      startDate: dayjs(holiday.startDate).format(DATE_FORMAT),
      endDate: dayjs(holiday.endDate).format(DATE_FORMAT),
      description: holiday.userComment || '',
      chargeYear: dayjs(holiday.chargeYear)
        .local()
        .format(DATE_FORMAT)
    })
    onOpen()
  }

  const handleClose = () => {
    setInitialFormValues(initialFormState)
    onClose()
  }

  // when the user changes the page, clear the cache
  useEffect(() => {
    resourceCache(fetchHolidaysByChargeYear).clear()
  }, [])

  return (
    <Fragment>
      <Navbar />
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
              onRefreshHolidays={(year) => fetchHolidaysByYear(dayjs().year(year))}
              onChangeYear={setSelectedChargeYear}
            />
          </Suspense>
          <Suspense fallback={<SkeletonText noOfLines={4} spacing="4" />}>
            <VacationInformation
              userReader={userReader}
              holidaysReader={holidaysReader}
              selectedYear={dayjs()
                .year(selectedChargeYear)
                .startOf('year')
                .toDate()}
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
    </Fragment>
  )
}

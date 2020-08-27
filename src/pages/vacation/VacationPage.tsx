// @ts-ignore
// prettier-ignore
import React, { Suspense, useState, unstable_SuspenseList as SuspenseList } from 'react'
import {
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Select,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Button,
  Heading,
  useDisclosure
} from '@chakra-ui/core'
import { RequestVacationForm } from 'pages/vacation/RequestVacationForm'
import { useAsyncResource } from 'use-async-resource'
import { fetchHolidaysBetweenDate } from 'api/HolidaysAPI'
import { resourceCache } from 'use-async-resource/lib'
import { format } from 'date-fns'
import { last } from 'utils/helpers'
import httpClient from 'services/HttpClient'
import { VacationTable } from './VacationTable/VacationTable'
import { VacationInformation } from './VacationInformation'
import { SelectYear } from './SelectYear'
import { IPrivateHoliday } from 'api/interfaces/IHolidays'
import { useTranslation } from 'react-i18next'

async function fetchVacationInfoByYear(year: string | number) {
  return await httpClient
    .get('api/vacation?year=' + year)
    .json<VacationInformation>()
}

const startDate = new Date(2020, 0, 1)
const endDate = new Date(2020, 11, 31)

const initialYear = startDate.getFullYear()

export interface FormValues {
  id?: number
  period: string
  description: string
  chargeYear: string
}

export function VacationPage() {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [initialFormValues, setInitialFormValues] = useState<FormValues>({
    id: undefined,
    period: '',
    description: '',
    chargeYear: new Date().getFullYear().toString()
  })

  const [holidaysReader, fetchHolidays] = useAsyncResource(
    fetchHolidaysBetweenDate,
    startDate,
    endDate
  )
  const [vacationInfoReader, fetchVacationInfo] = useAsyncResource(
    fetchVacationInfoByYear,
    initialYear
  )

  const refreshHolidays = (newYear: number | undefined = initialYear) => {
    resourceCache(fetchHolidaysBetweenDate).clear()
    resourceCache(fetchVacationInfoByYear).clear()

    fetchHolidays(new Date(newYear, 0, 1), new Date(newYear, 11, 31))
    fetchVacationInfo(newYear)
  }

  const handleVacationPeriodEdit = (vacationPeriod: IPrivateHoliday) => {
    const formatString = 'dd/MM/yyyy'
    const period =
      format(vacationPeriod.days[0], formatString) +
      ' - ' +
      format(last(vacationPeriod.days)!, formatString)

    setInitialFormValues({
      id: vacationPeriod.id,
      period: period,
      description: vacationPeriod.userComment || '',
      chargeYear: 'option1'
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
          <SelectYear onRefreshHolidays={refreshHolidays} />
        </Suspense>
        <Suspense fallback={<SkeletonText noOfLines={4} spacing="4" />}>
          <VacationInformation vacationReader={vacationInfoReader} />
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
            onEdit={handleVacationPeriodEdit}
            onRefreshHolidays={refreshHolidays}
          />
        </Suspense>
      </SuspenseList>
    </Stack>
  )
}

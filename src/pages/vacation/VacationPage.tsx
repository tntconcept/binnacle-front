import React, {
  Fragment,
  Suspense,
  // @ts-ignore
  unstable_SuspenseList as SuspenseList,
  useCallback,
  useEffect,
  useState
} from 'react'
import {
  Button,
  Flex,
  Skeleton,
  SkeletonText,
  Stack,
  useDisclosure,
  useToast
} from '@chakra-ui/core'
import { RequestVacationForm } from 'pages/vacation/RequestVacationForm'
import { useAsyncResource } from 'use-async-resource'
import { resourceCache } from 'use-async-resource/lib'
import { VacationTable } from './VacationTable/VacationTable'
import { IVacationDetails, VacationInformation } from './VacationInformation'
import { SelectYear } from './SelectYear'
import { IVacation } from 'api/interfaces/IHolidays'
import { useTranslation } from 'react-i18next'
import fetchLoggedUser from 'api/user/fetchLoggedUser'
import { fetchHolidaysByChargeYear } from 'api/vacation/fetchHolidaysByChargeYear'
import Navbar from 'core/features/Navbar/Navbar'
import { useTitle } from 'core/hooks/useTitle'
import { CreateVacationPeriodResponse } from 'api/vacation/vacation.interfaces'
import HttpClient from 'services/HttpClient'
import chrono from 'services/Chrono'

export async function fetchVacationDetails(chargeYear: number): Promise<IVacationDetails> {
  const response = await HttpClient.get('api/vacations/details', {
    searchParams: {
      chargeYear: chargeYear
    }
  }).json<IVacationDetails>()

  return response
}

const startDate = chrono().startOf('year')
const endDate = chrono().endOf('year')

const initialValues = {
  startDate: startDate.format(chrono.DATE_FORMAT),
  endDate: endDate.format(chrono.DATE_FORMAT),
  chargeYear: startDate.get('year')
}

export interface FormValues {
  id?: number
  description: string
  startDate?: ISO8601Date
  endDate?: ISO8601Date
}

const initialFormState = {
  id: undefined,
  startDate: '',
  endDate: '',
  description: '',
  chargeYear: chrono().get('year')
}

function VacationPage() {
  const { t } = useTranslation()
  useTitle(t('pages.vacations'))
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [initialFormValues, setInitialFormValues] = useState<FormValues>(initialFormState)
  const [selectedChargeYear, setSelectedChargeYear] = useState(chrono().get('year'))

  const [holidaysReader, fetchHolidays] = useAsyncResource(
    fetchHolidaysByChargeYear,
    initialValues.chargeYear
  )
  const [userReader] = useAsyncResource(fetchLoggedUser, [])
  const [vacationDetailsReader, fetchDetails] = useAsyncResource(
    fetchVacationDetails,
    selectedChargeYear
  )

  const fetchHolidaysByYear = useCallback(
    (year: number) => {
      resourceCache(fetchHolidaysByChargeYear).clear()
      resourceCache(fetchVacationDetails).clear()

      fetchHolidays(year)
      fetchDetails(year)
    },
    [fetchDetails, fetchHolidays]
  )

  const handleHolidayEdit = (holiday: IVacation) => {
    setInitialFormValues({
      id: holiday.id,
      startDate: chrono(holiday.startDate).format(chrono.DATE_FORMAT),
      endDate: chrono(holiday.endDate).format(chrono.DATE_FORMAT),
      description: holiday.description || ''
    })
    onOpen()
  }

  const toast = useToast()

  const handleClose = (period?: CreateVacationPeriodResponse[]) => {
    setInitialFormValues(initialFormState)

    if (period !== undefined) {
      const description =
        period.length === 1
          ? t('vacation.create_vacation_notification_message_all', {
              year: period[0].chargeYear
            })
          : t('vacation.create_period_notification_message_by_year', {
              count: period[0].days,
              daysFirstYear: period[0].days,
              firstYear: period[0].chargeYear,
              secondYear: period[1].chargeYear
            })

      toast({
        title: t('vacation.create_vacation_notification_title'),
        description: description,
        status: 'success',
        duration: 10000,
        isClosable: true,
        position: 'top-right'
      })
    }

    onClose()
  }

  // when the user changes the page, clear the cache
  useEffect(() => {
    resourceCache(fetchHolidaysByChargeYear).clear()
  }, [])

  return (
    <Fragment>
      <Navbar />
      <Stack m={4} spacing={4}>
        <Flex align="flex-end" justify="space-between" maxWidth="600px">
          <Suspense fallback={<Skeleton height="32px" width="100px" />}>
            <SelectYear
              userReader={userReader}
              onRefreshHolidays={(year) => fetchHolidaysByYear(year)}
              onChangeYear={setSelectedChargeYear}
            />
          </Suspense>
          <Button onClick={onOpen} size="md">
            {t('vacation_form.open_form_button')}
          </Button>
        </Flex>
        <RequestVacationForm
          isOpen={isOpen}
          onClose={handleClose}
          initialValues={initialFormValues}
          onRefreshHolidays={() => fetchHolidaysByYear(selectedChargeYear)}
        />
        <SuspenseList revealOrder="forwards">
          <Suspense fallback={<SkeletonText noOfLines={4} spacing="4" />}>
            <VacationInformation
              vacationDetailsReader={vacationDetailsReader}
              selectedYear={chrono()
                .set(selectedChargeYear, 'year')
                .startOf('year')
                .getDate()}
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
              onRefreshHolidays={() => fetchHolidaysByYear(selectedChargeYear)}
            />
          </Suspense>
        </SuspenseList>
      </Stack>
    </Fragment>
  )
}

export default VacationPage

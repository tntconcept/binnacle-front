import { FC, useEffect, useMemo, useState } from 'react'
import { Box, Flex, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetAbsencesQry } from '../../../application/get-absences-qry'
import { useCalendarContext } from '../../../../activity/ui/contexts/calendar-context'
import { AbsenceFilters } from '../../../domain/absence-filters'
import { useGetUseCase } from '../../../../../../../shared/arch/hooks/use-get-use-case'
import { GetHolidaysByYearQry } from '../../../../holiday/application/get-holidays-by-year-qry'
import { useTranslation } from 'react-i18next'
import { AvailabilityTableCellHeader } from './availability-table-cell/availability-table-cell-header'
import { AvailabilityTableCell } from './availability-table-cell/availability-table-cell'
import { AbsenceWithOverflowInfo } from '../../../domain/absence-with-overflow-info'
import { UserAbsence } from '../../../domain/user-absence'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'
import { AvailabilityTableHeader } from './availability-table-header/availability-table-header'
import styles from './availability-table.module.css'

export const AvailabilityTable: FC = () => {
  const { selectedDate } = useCalendarContext()
  const [userAbsences, setUserAbsences] = useState<UserAbsence[]>([])
  const [previousDate, setPreviousDate] = useState<Date | null>(null)
  const [absenceFilters, setAbsenceFilters] = useState<AbsenceFilters>({
    startDate: chrono().format(chrono.DATE_FORMAT),
    endDate: chrono().format(chrono.DATE_FORMAT)
  })

  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const selectedDateInterval = useMemo(() => {
    return {
      start: chrono(selectedDate).startOf('month').getDate(),
      end: chrono(selectedDate).endOf('month').getDate()
    }
  }, [selectedDate])

  const { executeUseCase: getAbsencesQry, isLoading } = useGetUseCase(GetAbsencesQry)

  const daysOfMonth = chrono(selectedDateInterval.start).eachDayUntil(selectedDateInterval.end)

  const { result: holidays = [] } = useExecuteUseCaseOnMount(
    GetHolidaysByYearQry,
    selectedDateInterval.start.getFullYear()
  )

  const requiredFiltersAreSelected = () =>
    absenceFilters.organizationIds !== undefined || absenceFilters.userIds !== undefined

  useEffect(() => {
    if (
      requiredFiltersAreSelected() &&
      previousDate?.getFullYear() !== selectedDate.getFullYear()
    ) {
      getAbsencesQry({
        ...absenceFilters,
        startDate: chrono(selectedDateInterval.start)
          .startOf('year')
          .minus(1, 'year')
          .format(chrono.DATE_FORMAT),
        endDate: chrono(selectedDate).endOf('year').format(chrono.DATE_FORMAT)
      }).then((absences) => {
        setUserAbsences(absences)
        setPreviousDate(selectedDate)
      })
    }
  }, [absenceFilters, selectedDateInterval, previousDate])

  const checkIfHoliday = (day: Date) =>
    holidays.some((holiday) => chrono(day).isSameDay(holiday.date))

  const onFilterChange = (updatedFilter: Partial<AbsenceFilters>) => {
    setAbsenceFilters({ ...absenceFilters, ...updatedFilter })
  }

  useEffect(() => {
    const element = document.querySelector('thead')
    if (element) {
      element.scrollIntoView({ inline: 'center', block: 'end' })
    }
  }, [userAbsences])

  const updateAbsencesBasedOnInterval = (userAbsence: UserAbsence) => {
    return userAbsence.absences
      .map((absence) => {
        const checkIfStartDateAndEndDateAreInsideInterval =
          chrono(absence.startDate).isDateWithinInterval(selectedDateInterval) &&
          chrono(absence.endDate).isDateWithinInterval(selectedDateInterval)

        const CheckIfBothDatesAreOutsideOfInterval =
          !chrono(absence.startDate).isDateWithinInterval(selectedDateInterval) &&
          !chrono(absence.endDate).isDateWithinInterval(selectedDateInterval) &&
          chrono(selectedDateInterval.start).isDateWithinInterval({
            start: chrono(absence.startDate).getDate(),
            end: chrono(absence.endDate).getDate()
          })

        const checkIfEndDateIsOutsideOfInterval =
          chrono(absence.startDate).isDateWithinInterval(selectedDateInterval) &&
          !chrono(absence.endDate).isDateWithinInterval(selectedDateInterval)

        const checkIfStartDateIsOutsideOfInterval =
          !chrono(absence.startDate).isDateWithinInterval(selectedDateInterval) &&
          chrono(absence.endDate).isDateWithinInterval(selectedDateInterval)

        if (checkIfStartDateAndEndDateAreInsideInterval) {
          return { ...absence, overflowType: 'normal' }
        }

        if (checkIfEndDateIsOutsideOfInterval) {
          return { ...absence, endDate: selectedDateInterval.end, overflowType: 'end' }
        }

        if (checkIfStartDateIsOutsideOfInterval) {
          return {
            ...absence,
            startDate: selectedDateInterval.start,
            overflowType: 'start'
          }
        }
        if (CheckIfBothDatesAreOutsideOfInterval) {
          return {
            ...absence,
            startDate: selectedDateInterval.start,
            endDate: selectedDateInterval.end,
            overflowType: 'both'
          }
        }
      })
      .filter((x) => x !== undefined) as AbsenceWithOverflowInfo[]
  }

  const tableHeaders = (
    <Thead>
      <Tr>
        <Th></Th>
        {daysOfMonth.map((day, index) => (
          <AvailabilityTableCellHeader
            key={index}
            day={day}
            isHoliday={checkIfHoliday(day)}
          ></AvailabilityTableCellHeader>
        ))}
      </Tr>
    </Thead>
  )

  const tableRows = (
    <Tbody>
      {userAbsences?.map((userAbsence, index) => (
        <Tr key={index}>
          <Td px={isMobile ? '16px' : '24px'} py={'10px'}>
            <Text width={'12ch'} fontSize={isMobile ? 'small' : 'medium'} isTruncated>
              {userAbsence.userName}
            </Text>
          </Td>
          {daysOfMonth.map((day, index) => (
            <AvailabilityTableCell
              key={index}
              day={day}
              userName={userAbsence.userName}
              absences={updateAbsencesBasedOnInterval(userAbsence).filter((x) =>
                chrono(day).isSameDay(x.startDate)
              )}
              isHoliday={checkIfHoliday(day)}
            ></AvailabilityTableCell>
          ))}
        </Tr>
      ))}
    </Tbody>
  )

  const layoutWithData = (
    <Box
      display="flex"
      flexDirection="column"
      overflowX="auto"
      overflowY="hidden"
      marginBottom="16px"
    >
      <Table className={styles['data-table']}>
        {tableHeaders}
        {tableRows}
      </Table>
    </Box>
  )

  return (
    <>
      <AvailabilityTableHeader onFilterChange={onFilterChange}></AvailabilityTableHeader>
      {isLoading ? (
        <Flex justifyContent="center">
          <Spinner></Spinner>
        </Flex>
      ) : !requiredFiltersAreSelected() ? (
        <Text>{t('absences.requiredFilters')}</Text>
      ) : userAbsences.length === 0 ? (
        <Text>{t('absences.emptyMessage')}</Text>
      ) : (
        layoutWithData
      )}
    </>
  )
}

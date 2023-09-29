import { FC, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react'
import styles from './availability-table.module.css'
import { AvailabilityTableFilters } from './availability-table-filters/availability-table-filters'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetAbsencesQry } from '../../../application/get-absences-qry'
import { CalendarControls } from '../../../../activity/ui/calendar-desktop/calendar-controls/calendar-controls'
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

export const AvailabilityTable: FC = () => {
  const { selectedDate } = useCalendarContext()
  const [userAbsences, setUserAbsences] = useState<UserAbsence[]>([])
  const [absenceFilters, setAbsenceFilters] = useState<AbsenceFilters>({
    startDate: chrono().format(chrono.DATE_FORMAT),
    endDate: chrono().format(chrono.DATE_FORMAT)
  })

  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const selectedDateInterval = useMemo(() => {
    return {
      start: chrono(selectedDate).startOf('month').minus(5, 'day').getDate(),
      end: chrono(selectedDate).endOf('month').plus(5, 'day').getDate()
    }
  }, [selectedDate])

  const { useCase: getAbsencesQry } = useGetUseCase(GetAbsencesQry)

  const daysOfMonth = chrono(selectedDateInterval.start).eachDayUntil(selectedDateInterval.end)

  const { result: holidays = [] } = useExecuteUseCaseOnMount(
    GetHolidaysByYearQry,
    selectedDateInterval.start.getFullYear()
  )

  const requiredFiltersAreSelected = () =>
    absenceFilters.organizationIds !== undefined || absenceFilters.userIds !== undefined

  useEffect(() => {
    if (requiredFiltersAreSelected()) {
      getAbsencesQry
        .execute({
          ...absenceFilters,
          startDate: chrono(selectedDateInterval.start).format(chrono.DATE_FORMAT),
          endDate: chrono(selectedDateInterval.end).format(chrono.DATE_FORMAT)
        })
        .then((absences) => {
          setUserAbsences(absences)
        })
    } else {
      setUserAbsences([])
    }
  }, [absenceFilters, selectedDateInterval])

  const checkIfHoliday = (day: Date) =>
    holidays.some((holiday) => chrono(day).isSameDay(holiday.date))

  const borderColor = useColorModeValue('gray.300', 'gray.700')

  const onFilterChange = (updatedFilter: Partial<AbsenceFilters>) => {
    setAbsenceFilters({ ...absenceFilters, ...updatedFilter })
  }

  const tableHeaders = (
    <Thead>
      <Tr>
        <Th border="none"></Th>
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

  useEffect(() => {
    const element = document.getElementById('is-today')
    if (element !== null) element.scrollIntoView({ inline: 'center' })
  }, [selectedDate])

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

  const tableRows = (
    <Tbody>
      {userAbsences?.map((userAbsence, index) => (
        <Tr key={index}>
          <Td outline={`solid`} outlineColor={borderColor} outlineOffset={'-1px'}>
            <Text width={isMobile ? '10ch' : '20ch'} isTruncated>
              {userAbsence.userName}
            </Text>
          </Td>
          {daysOfMonth.map((day, index) => (
            <AvailabilityTableCell
              key={index}
              day={day}
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

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        border="none"
        marginBottom="16px"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={isMobile ? 3 : 0}
      >
        <AvailabilityTableFilters onChange={onFilterChange} />
        <CalendarControls />
      </Flex>
      {!requiredFiltersAreSelected() ? (
        <Text>{t('absences.requiredFilters')}</Text>
      ) : userAbsences.length === 0 ? (
        <Text>{t('absences.emptyMessage')}</Text>
      ) : (
        <Box display="flex" flexDirection="column" overflowX="auto" overflowY="hidden">
          <Table className={styles['data-table']}>
            {tableHeaders}
            {tableRows}
          </Table>
        </Box>
      )}
    </>
  )
}

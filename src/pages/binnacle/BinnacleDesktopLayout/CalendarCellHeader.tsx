import React, { forwardRef, useMemo } from 'react'
import { getDate, isSameMonth, isToday } from 'date-fns'
import { getDuration } from 'utils/TimeUtils'
import DateTime from 'services/DateTime'
import { isVacation, isHoliday } from 'utils/DateUtils'
import { useTranslation } from 'react-i18next'
import { useBinnacleResources } from 'core/features/BinnacleResourcesProvider'
import { Box, Flex, Text } from '@chakra-ui/core'
import { useSettings } from 'pages/settings/Settings.utils'

interface ICellHeader {
  date: Date
  time: number
}

const CalendarCellHeader = forwardRef<HTMLButtonElement, ICellHeader>((props, ref) => {
  const { t } = useTranslation()
  const { selectedMonth, holidayReader } = useBinnacleResources()
  const holidays = holidayReader()

  const settings = useSettings()
  const today = isToday(props.date)

  const holidayFound = useMemo(() => isHoliday(holidays.holidays, props.date), [
    props.date,
    holidays.holidays
  ])
  const vacationFound = useMemo(() => isVacation(holidays.vacations, props.date), [
    props.date,
    holidays.vacations
  ])

  const holidayDescription = holidayFound
    ? holidayFound.description
    : vacationFound
      ? t('vacations')
      : undefined

  const holidayLabel = holidayDescription !== undefined ? `, ${holidayDescription}` : ''
  const timeLabel = DateTime.getHumanizedDuration(props.time, false)
  const dayLabel =
    DateTime.format(props.date, 'd, EEEE MMMM yyyy') +
    (timeLabel !== '' ? ', ' + timeLabel : '') +
    holidayLabel

  const a11yFocusDay = useMemo(() => {
    if (DateTime.isThisMonth(selectedMonth)) {
      return today ? 0 : -1
    }

    return DateTime.isFirstDayOfMonth(props.date) && isSameMonth(selectedMonth, props.date) ? 0 : -1
  }, [props.date, selectedMonth, today])

  return (
    <React.Fragment>
      {holidayFound || vacationFound ? (
        <Box
          position="absolute"
          top={0}
          left={0}
          height="6px"
          width="100%"
          bgColor={holidayFound ? 'yellow.400' : 'blue.400'}
        />
      ) : null}
      <Header
        tabIndex={a11yFocusDay}
        aria-label={dayLabel}
        ref={ref}
        aria-current={today ? 'date' : undefined}
      >
        {today ? (
          <Today data-testid="today">{getDate(props.date)}</Today>
        ) : (
          <Text as="span" fontSize="xs" color="#727272">
            {getDate(props.date)}
          </Text>
        )}
        {holidayDescription && (
          <Text as="span" ml={2} mr="auto">
            {holidayDescription}
          </Text>
        )}
        {props.time !== 0 && (
          <Text as="span" ml="auto" mr={2}>
            {getDuration(props.time, settings.useDecimalTimeFormat)}
          </Text>
        )}
      </Header>
    </React.Fragment>
  )
})

const Today: React.FC = (props) => {
  return (
    <Flex
      align="center"
      justify="center"
      fontSize="xs"
      color="white"
      ml="-4px"
      borderRadius="50%"
      bgColor="brand.600"
      fontWeight={600}
      minWidth="24px"
      height="24px"
      {...props}
    >
      {props.children}
    </Flex>
  )
}

const Header = forwardRef<HTMLButtonElement, any>((props, ref) => (
  <Flex
    as="button"
    fontSize="xs"
    fontFamily='"Work sans", "Helvetica", "Arial", sans-serif'
    justify="space-between"
    align="center"
    position="relative"
    minHeight="24px"
    textAlign="left"
    color="#727272"
    bgColor="transparent"
    border="none"
    width="100%"
    ref={ref}
    {...props}
  >
    {props.children}
  </Flex>
))

export default CalendarCellHeader

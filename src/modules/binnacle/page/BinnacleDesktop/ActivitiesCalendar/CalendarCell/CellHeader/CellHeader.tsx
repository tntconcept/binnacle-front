import { Box, Flex, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { getDurationByMinutes } from 'modules/binnacle/data-access/utils/getDuration'
import { getHoliday } from 'modules/binnacle/data-access/utils/getHoliday'
import { getVacation } from 'modules/binnacle/data-access/utils/getVacation'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import type { Holidays } from 'shared/types/Holidays'
import chrono, { getHumanizedDuration, isFirstDayOfMonth } from 'shared/utils/chrono'
import { observer } from 'mobx-react'
import { CameraIcon } from '@heroicons/react/outline'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'

interface ICellHeader {
  date: Date
  time: number
  holidays: Holidays
  selectedMonth: Date
}

/*eslint-disable */
export const CellHeader = observer(
  forwardRef((props: ICellHeader, ref: ForwardedRef<HTMLButtonElement>) => {
    const { settings } = useGlobalState(SettingsState)
    const isToday = chrono(props.date).isToday()

    const holidayDescription = useGetHolidayDescription(props.holidays, props.date)
    const a11yLabel = getA11yLabel(props.date, props.time, holidayDescription?.description)
    const a11yTabIndex = getA11yTabIndex(props.selectedMonth, props.date)

    const dayColor = useColorModeValue('#727272', 'white')

    return (
      <Fragment>
        {holidayDescription ? (
          <Box
            position="absolute"
            top={0}
            left={0}
            height="6px"
            width="100%"
            bgColor={holidayDescription.type === 'holiday' ? 'yellow.400' : 'blue.400'}
          />
        ) : null}
        <Header
          tabIndex={a11yTabIndex}
          aria-label={a11yLabel}
          ref={ref}
          aria-current={isToday ? 'date' : undefined}
        >
          {isToday ? (
            <Today data-testid="today">{chrono(props.date).get('date')}</Today>
          ) : (
            <Text data-testid="cell-date" as="span" fontSize="xs" color={dayColor}>
              {chrono(props.date).get('date')}
            </Text>
          )}
          <VerifiedProjects date={props.date} />
          {holidayDescription && (
            <Text as="span" ml={2} mr="auto">
              {holidayDescription.description}
            </Text>
          )}
          {props.time !== 0 && (
            <Text data-testid="cell-time" as="span" ml="auto" mr={2}>
              {getDurationByMinutes(props.time, settings.useDecimalTimeFormat)}
            </Text>
          )}
        </Header>
      </Fragment>
    )
  })
)

CellHeader.displayName = 'CellHeader'

const VerifiedProjects = observer((props: { date: Date }) => {
  const { activities } = useGlobalState(BinnacleState)
  const bgIconColor = useColorModeValue('#727272', 'whiteAlpha.900')

  const verifications = activities
    .filter((a) => chrono(a.date).isSame(props.date, 'day'))
    .flatMap((a) => a.activities)
    .filter((a) => a.hasImage)
    .map((a) => a.project.name)
    .join(', ')

  if (verifications.length === 0) {
    return null
  }

  return (
    <Tooltip label={verifications}>
      <Text as="span" ml="1" color={bgIconColor}>
        <CameraIcon width="12px" data-testid="verified_projects" />
      </Text>
    </Tooltip>
  )
})

const Today = (props: { children: ReactNode }) => {
  const bgColor = useColorModeValue('brand.600', 'darkBrand.400')

  return (
    <Flex
      align="center"
      justify="center"
      fontSize="xs"
      color="white"
      ml="-4px"
      borderRadius="50%"
      bgColor={bgColor}
      fontWeight={600}
      minWidth="24px"
      height="24px"
      {...props}
    >
      {props.children}
    </Flex>
  )
}

const Header = forwardRef<HTMLButtonElement, any>((props, ref) => {
  const dayColor = useColorModeValue('#727272', 'whiteAlpha.900')

  return (
    <Flex
      as="button"
      fontSize="xs"
      fontFamily='"Work sans", "Helvetica", "Arial", sans-serif'
      justify="space-between"
      align="center"
      position="relative"
      minHeight="24px"
      textAlign="left"
      color={dayColor}
      bgColor="transparent"
      border="none"
      width="100%"
      ref={ref}
      {...props}
    >
      {props.children}
    </Flex>
  )
})

Header.displayName = 'Header'

const useGetHolidayDescription = ({ holidays, vacations }: Holidays, date: Date) => {
  const { t } = useTranslation()

  const holiday = getHoliday(holidays, date)
  const vacation = getVacation(vacations, date)

  if (holiday) {
    return {
      description: holiday.description,
      type: 'holiday'
    }
  } else if (vacation) {
    return {
      description: t('vacations'),
      type: 'vacation'
    }
  }

  return undefined
}

const getA11yLabel = (date: Date, time: number, holidayDescription?: string) => {
  const dateDescription = chrono(date).format('d, EEEE MMMM yyyy')
  const timeDescription = getHumanizedDuration(time, false)

  return [dateDescription, timeDescription, holidayDescription]
    .filter((value) => value !== undefined && value !== '')
    .join(', ')
}

const getA11yTabIndex = (selectedMonth: Date, date: Date) => {
  if (chrono(selectedMonth).isThisMonth()) {
    return chrono(date).isToday() ? 0 : -1
  }

  return chrono(selectedMonth).isSame(date, 'month') && isFirstDayOfMonth(date) ? 0 : -1
}

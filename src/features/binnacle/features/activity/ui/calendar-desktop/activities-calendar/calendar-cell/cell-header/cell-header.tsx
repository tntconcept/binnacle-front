import { Box, Flex, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { CameraIcon } from '@heroicons/react/24/outline'
import { Activity } from '../../../../../domain/activity'
import { getDurationByHours } from '../../../../../utils/get-duration'
import { Holiday } from '../../../../../../holiday/domain/holiday'
import { Vacation } from '../../../../../../vacation/domain/vacation'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import {
  chrono,
  getHumanizedDuration,
  isFirstDayOfMonth
} from '../../../../../../../../../shared/utils/chrono'
import { useCalendarContext } from '../../../../contexts/calendar-context'

interface Props {
  date: Date
  time: number
  holiday?: Holiday
  vacation?: Vacation
  selectedMonth: Date
  activities: Activity[]
}

export const CellHeader = forwardRef((props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  const { date, time, holiday, vacation, selectedMonth, activities } = props
  const { shouldUseDecimalTimeFormat } = useCalendarContext()
  const isToday = chrono(date).isToday()

  const holidayDescription = useGetHolidayDescription(holiday, vacation)
  const a11yLabel = getA11yLabel(date, time, holidayDescription?.description)
  const a11yTabIndex = getA11yTabIndex(selectedMonth, date)

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
          <Today data-testid="today">{chrono(date).get('date')}</Today>
        ) : (
          <Text data-testid="cell-date" as="span" fontSize="xs" color={dayColor}>
            {chrono(date).get('date')}
          </Text>
        )}
        <ProjectsWithEvidences activities={activities} />
        {holidayDescription && (
          <Text as="span" ml={2} mr="auto">
            {holidayDescription.description}
          </Text>
        )}
        {props.time !== 0 && (
          <Text data-testid="cell-time" as="span" ml="auto" mr={2}>
            {getDurationByHours(props.time, shouldUseDecimalTimeFormat)}
          </Text>
        )}
      </Header>
    </Fragment>
  )
})
CellHeader.displayName = 'CellHeader'

const ProjectsWithEvidences = ({ activities }: { activities: Activity[] }) => {
  const bgIconColor = useColorModeValue('#727272', 'whiteAlpha.900')

  const verifications = activities
    .filter((a) => a.hasEvidences)
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
}

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

const useGetHolidayDescription = (holiday?: Holiday, vacation?: Vacation) => {
  const { t } = useTranslation()

  if (holiday) {
    return {
      description: holiday.description,
      type: 'holiday'
    }
  }

  if (vacation) {
    return {
      description: t('vacations'),
      type: 'vacation'
    }
  }

  return null
}

const getA11yLabel = (date: Date, time: number, holidayDescription?: string) => {
  const dateDescription = chrono(date).format('d, EEEE MMMM yyyy')
  const timeDescription = getHumanizedDuration({
    duration: time * 60,
    abbreviation: false,
    timeUnit: 'MINUTES'
  })

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

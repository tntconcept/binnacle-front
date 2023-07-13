import { Flex, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { CameraIcon } from '@heroicons/react/outline'
import { Activity } from 'features/binnacle/features/activity/domain/activity'
import { getDurationByHours } from 'features/binnacle/features/activity/utils/get-duration'
import type { ReactNode } from 'react'
import { forwardRef, Fragment } from 'react'
import { chrono, getHumanizedDuration, isFirstDayOfMonth } from 'shared/utils/chrono'
import { useCalendarContext } from '../../../../contexts/calendar-context'

interface Props {
  date: Date
  time: number
  header?: JSX.Element
  description?: string
  selectedMonth: Date
  activities: Activity[]
}

export const CellHeaderRefactor = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { date, time, selectedMonth, description, header, activities } = props
  const { shouldUseDecimalTimeFormat } = useCalendarContext()
  const isToday = chrono(date).isToday()

  const a11yLabel = getA11yLabel(date, time, props.description)
  const a11yTabIndex = getA11yTabIndex(selectedMonth, date)

  const dayColor = useColorModeValue('#727272', 'white')

  return (
    <Fragment>
      {header}
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
        {description && (
          <Text as="span" ml={2} mr="auto">
            {description}
          </Text>
        )}
        {time !== 0 && (
          <Text data-testid="cell-time" as="span" ml="auto" mr={2}>
            {getDurationByHours(time, shouldUseDecimalTimeFormat)}
          </Text>
        )}
      </Header>
    </Fragment>
  )
})

CellHeaderRefactor.displayName = 'CellHeader'

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

const getA11yLabel = (date: Date, time: number, description?: string) => {
  const dateDescription = chrono(date).format('d, EEEE MMMM yyyy')
  const timeDescription = getHumanizedDuration({
    duration: time * 60,
    abbreviation: false,
    timeUnit: 'MINUTES'
  })

  return [dateDescription, timeDescription, description]
    .filter((value) => value !== undefined && value !== '')
    .join(', ')
}

const getA11yTabIndex = (selectedMonth: Date, date: Date) => {
  if (chrono(selectedMonth).isThisMonth()) {
    return chrono(date).isToday() ? 0 : -1
  }

  return chrono(selectedMonth).isSame(date, 'month') && isFirstDayOfMonth(date) ? 0 : -1
}

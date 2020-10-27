import React from 'react'
import { useBinnacleResources } from 'core/providers/BinnacleResourcesProvider'
import { IHolidays } from 'core/api/interfaces'
import { ActivitiesList } from 'pages/binnacle/BinnacleMobile/BinnacleScreen/ActivitiesList'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ReactComponent as PlusIcon } from 'heroicons/outline/plus.svg'
import { IconButton, Icon, Flex, useColorModeValue } from '@chakra-ui/core'
import chrono, { getHumanizedDuration } from 'core/services/Chrono'
import { isHoliday, isVacation } from 'pages/binnacle/BinnaclePage.utils'

const ActivitiesSection: React.FC<{ selectedDate: Date }> = ({ selectedDate }) => {
  const { t } = useTranslation()
  const { activitiesReader, holidayReader } = useBinnacleResources()
  const holidays = holidayReader()
  const { activities: activitiesData } = activitiesReader()

  const day = activitiesData.find((activityDay) =>
    chrono(activityDay.date).isSame(selectedDate, 'day')
  )

  const getLastEndTime = () => {
    const lastActivity = day && day.activities[day.activities.length - 1]

    if (lastActivity) {
      return chrono(lastActivity.startDate)
        .plus(lastActivity.duration, 'minute')
        .getDate()
    }

    return undefined
  }

  const isHolidayOrVacation = (holidays: IHolidays, date: Date) => {
    const holiday = isHoliday(holidays.holidays, date)
    const vacation = isVacation(holidays.vacations, date)

    if (holiday) {
      return holiday.description
    }

    if (vacation) {
      return t('vacations')
    }

    return undefined
  }

  return (
    <>
      <Flex width="100%" p="10px 16px" justify="flex-end" data-testid="activities_time">
        {isHolidayOrVacation(holidays, selectedDate) && (
          <span
            style={{
              marginRight: 'auto'
            }}
          >
            {isHolidayOrVacation(holidays, selectedDate)}
          </span>
        )}
        {day && getHumanizedDuration(day.workedMinutes)}
      </Flex>
      <ActivitiesList activities={day?.activities ?? []} />
      <FloatingActionButton selectedDate={selectedDate} lastEndTime={getLastEndTime()} />
    </>
  )
}

interface IFloatingActionButton {
  selectedDate: Date
  lastEndTime: Date | undefined
}

const FloatingActionButton: React.FC<IFloatingActionButton> = (props) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue(undefined, 'darkBrand.400')

  return (
    <IconButton
      as={Link}
      to={{
        pathname: '/binnacle/activity',
        state: {
          date: props.selectedDate,
          lastEndTime: props.lastEndTime
        }
      }}
      icon={<Icon as={PlusIcon} boxSize={6} />}
      aria-label={t('accessibility.new_activity')}
      isRound={true}
      colorScheme="brand"
      data-testid="add_activity"
      size="lg"
      position="fixed"
      right="16px"
      bottom="20px"
      bgColor={bgColor}
    />
  )
}

export default ActivitiesSection

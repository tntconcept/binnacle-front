import React from 'react'
import { useBinnacleResources } from 'features/BinnacleResourcesProvider'
import { addMinutes, isSameDay } from 'date-fns'
import { IHolidays } from 'api/interfaces/IHolidays'
import { isPrivateHoliday, isPublicHoliday } from 'utils/DateUtils'
import styles from 'pages/binnacle/BinnacleMobileLayout/FloatingActionButton.module.css'
import DateTime from 'services/DateTime'
import { ActivitiesList } from 'pages/binnacle/BinnacleMobileLayout/ActivitiesList'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ActivitiesSection: React.FC<{ selectedDate: Date }> = ({ selectedDate }) => {
  const { t } = useTranslation()
  const { activitiesReader, holidayReader } = useBinnacleResources()
  const holidays = holidayReader()
  const { activities: activitiesData } = activitiesReader()

  const day = activitiesData.find((activityDay) =>
    isSameDay(activityDay.date, selectedDate)
  )

  const getLastEndTime = () => {
    const lastActivity = day && day.activities[day.activities.length - 1]

    if (lastActivity) {
      return addMinutes(lastActivity.startDate, lastActivity.duration)
    }

    return undefined
  }

  const isHoliday = (holidays: IHolidays, date: Date) => {
    const isHoliday = isPublicHoliday(holidays.publicHolidays, date)
    const isVacation = isPrivateHoliday(holidays.privateHolidays, date)

    if (isHoliday) {
      return isHoliday.description
    }

    if (isVacation) {
      return t('vacations')
    }

    return undefined
  }

  return (
    <>
      <div
        className={styles.activitiesTime}
        data-testid="activities_time">
        {isHoliday(holidays, selectedDate) && (
          <span
            style={{
              marginRight: 'auto'
            }}
          >
            {isHoliday(holidays, selectedDate)}
          </span>
        )}
        {day && DateTime.getHumanizedDuration(day.workedMinutes)}
      </div>
      <ActivitiesList activities={day?.activities ?? []} />
      <Link
        to={{
          pathname: '/binnacle/activity',
          state: {
            date: selectedDate,
            lastEndTime: getLastEndTime()
          }
        }}
        className={styles.button}
        data-testid="add_activity"
      >
        +
      </Link>
    </>
  )
}

export default ActivitiesSection

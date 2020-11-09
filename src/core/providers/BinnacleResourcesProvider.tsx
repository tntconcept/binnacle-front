import React, { useContext, useState } from 'react'
import { BinnacleResourcesService } from 'core/services/BinnacleResourcesService'
import { ITimeBalance } from 'core/api/interfaces'
import { IActivityDay } from 'core/api/interfaces'
import { IHolidays } from 'core/api/interfaces'
import { IRecentRole } from 'core/api/interfaces'
import { DataOrModifiedFn, resourceCache, useAsyncResource } from 'use-async-resource'
import chrono from 'core/services/Chrono'
import fetchLoggedUser from 'core/api/users'

export type TimeBalanceMode = 'by_month' | 'by_year'

interface IActivitiesResources {
  activities: IActivityDay[]
  recentRoles: IRecentRole[] | undefined
}

interface Values {
  selectedMonth: Date
  changeMonth: (newMonth: Date) => void
  timeBalanceMode: TimeBalanceMode
  updateCalendarResources: () => void
  timeReader: DataOrModifiedFn<ITimeBalance>
  holidayReader: DataOrModifiedFn<IHolidays>
  activitiesReader: DataOrModifiedFn<IActivitiesResources>
  fetchTimeResource: (mode: 'by_month' | 'by_year') => void
}

export const BinnacleResourcesContext = React.createContext<Values>(null!)

const currentDate = chrono.now()

export const BinnacleResourcesProvider: React.FC = ({ children }) => {
  const [userReader] = useAsyncResource(fetchLoggedUser, [])
  const hiringDate = userReader().hiringDate

  const [selectedMonth, setSelectedMonth] = useState(currentDate)
  const [timeBalanceMode, setTimeBalanceMode] = useState<TimeBalanceMode>('by_month')
  const [timeReader, fetchTimeBalance] = useAsyncResource(
    BinnacleResourcesService.fetchTimeBalance,
    currentDate,
    'by_month',
    hiringDate
  )
  const [holidayReader, fetchHolidays] = useAsyncResource(
    BinnacleResourcesService.fetchHolidays,
    currentDate
  )
  const [activitiesReader, fetchActivities] = useAsyncResource(
    BinnacleResourcesService.fetchActivities,
    currentDate
  )

  const updateCalendarResources = () => {
    // Clear the cache of time balance, activities(and recent-roles)
    resourceCache(BinnacleResourcesService.fetchTimeBalance).clear()
    resourceCache(BinnacleResourcesService.fetchActivities).clear()

    fetchTimeBalance(selectedMonth, timeBalanceMode, hiringDate)
    fetchActivities(selectedMonth)
    fetchHolidays(selectedMonth)
  }

  const changeMonth = (newMonth: Date) => {
    fetchTimeBalance(newMonth, 'by_month', hiringDate)
    fetchActivities(newMonth)
    fetchHolidays(newMonth)

    setTimeBalanceMode('by_month')
    setSelectedMonth(newMonth)
  }

  const fetchTimeResource = (mode: TimeBalanceMode) => {
    setTimeBalanceMode(mode)
    fetchTimeBalance(selectedMonth, mode, hiringDate)
  }

  return (
    <BinnacleResourcesContext.Provider
      value={{
        selectedMonth,
        changeMonth,
        timeBalanceMode,
        timeReader,
        holidayReader,
        activitiesReader,
        updateCalendarResources,
        fetchTimeResource
      }}
    >
      {children}
    </BinnacleResourcesContext.Provider>
  )
}

export const useBinnacleResources = () => {
  return useContext(BinnacleResourcesContext)
}

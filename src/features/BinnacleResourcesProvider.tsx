import React, { useContext, useState } from 'react'
import { BinnacleResourcesService } from 'services/BinnacleResourcesService'
import { ITimeBalance } from 'api/interfaces/ITimeBalance'
import { IActivityDay } from 'api/interfaces/IActivity'
import { IHolidays } from 'api/interfaces/IHolidays'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import {
  DataOrModifiedFn,
  resourceCache,
  useAsyncResource
} from 'use-async-resource'

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

const currentDate = new Date()

export const BinnacleResourcesProvider: React.FC = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentDate)
  const [timeBalanceMode, setTimeBalanceMode] = useState<TimeBalanceMode>('by_month')
  const [timeReader, fetchTimeBalance] = useAsyncResource(
    BinnacleResourcesService.fetchTimeBalance,
    currentDate,
    'by_month'
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
    // Clear the cache of the selected month
    resourceCache(BinnacleResourcesService.fetchTimeBalance).delete(
      selectedMonth,
      timeBalanceMode
    )
    resourceCache(BinnacleResourcesService.fetchActivities).delete(selectedMonth)

    fetchTimeBalance(selectedMonth, timeBalanceMode)
    fetchActivities(selectedMonth)
    fetchHolidays(selectedMonth)
  }

  const changeMonth = (newMonth: Date) => {
    fetchTimeBalance(newMonth, 'by_month')
    fetchActivities(newMonth)
    fetchHolidays(newMonth)

    setTimeBalanceMode('by_month')
    setSelectedMonth(newMonth)
  }

  const fetchTimeResource = (mode: TimeBalanceMode) => {
    setTimeBalanceMode(mode)
    fetchTimeBalance(selectedMonth, mode)
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

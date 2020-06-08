import React, {useContext, useState} from "react"
import {CalendarResourcesService} from "services/CalendarResourcesService"
import {ITimeBalance} from "api/interfaces/ITimeBalance"
import {IActivityDay} from "api/interfaces/IActivity"
import {IHolidaysResponse} from "api/interfaces/IHolidays"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {DataOrModifiedFn, resourceCache, useAsyncResource} from 'use-async-resource'

export type TimeBalanceMode = "by_month" | "by_year"

interface IActivitiesResources {
  activities: IActivityDay[],
  recentRoles: IRecentRole[] | undefined
}

interface Values {
  selectedMonth: Date;
  changeMonth: (newMonth: Date) => void;
  timeBalanceMode: TimeBalanceMode
  updateCalendarResources: () => void;
  timeReader: DataOrModifiedFn<ITimeBalance>,
  holidayReader: DataOrModifiedFn<IHolidaysResponse>
  activitiesReader: DataOrModifiedFn<IActivitiesResources>,
  fetchTimeResource: (mode: "by_month" | "by_year" ) => void
}

export const CalendarResourcesContext = React.createContext<Values>(null!);

const currentDate = new Date();

export const CalendarResourcesProvider: React.FC = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentDate);
  const [timeBalanceMode, setTimeBalanceMode] = useState<TimeBalanceMode>("by_month")
  const [timeReader, fetchTimeBalance] = useAsyncResource(CalendarResourcesService.fetchTimeBalance, currentDate, "by_month")
  const [holidayReader, fetchHolidays] = useAsyncResource(CalendarResourcesService.fetchHolidays, currentDate)
  const [activitiesReader, fetchActivities] = useAsyncResource(CalendarResourcesService.fetchActivities, currentDate)
  
  const updateCalendarResources = () => {
    // Clear cache of this month
    resourceCache(CalendarResourcesService.fetchTimeBalance).delete(selectedMonth, timeBalanceMode)
    resourceCache(CalendarResourcesService.fetchActivities).delete(selectedMonth)

    fetchTimeBalance(selectedMonth, timeBalanceMode)
    fetchActivities(selectedMonth)
    fetchHolidays(selectedMonth)
  }

  const changeMonth = (newMonth: Date) => {
    fetchTimeBalance(newMonth, "by_month")
    fetchActivities(newMonth)
    fetchHolidays(newMonth)

    setTimeBalanceMode("by_month")
    setSelectedMonth(newMonth)
  }

  const fetchTimeResource = (mode: "by_month" | "by_year") => {
    setTimeBalanceMode(mode)
    fetchTimeBalance(selectedMonth, mode)
  }

  return (
    <CalendarResourcesContext.Provider
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
    </CalendarResourcesContext.Provider>
  );
};

export const useCalendarResources = () => {
  return useContext(CalendarResourcesContext)
}
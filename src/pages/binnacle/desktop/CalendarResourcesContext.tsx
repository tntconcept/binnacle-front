import React, {useContext, useState} from "react"
import {CalendarResources, ISuspenseAPI, wrapPromise} from "api/CacheSystem/CalendarResources"
import {ITimeBalance} from "api/interfaces/ITimeBalance"
import {IActivityDay} from "api/interfaces/IActivity"
import {IHolidaysResponse} from "api/interfaces/IHolidays"
import {IRecentRole} from "api/interfaces/IRecentRole"

interface ICalendarResourcesData {
  activities: IActivityDay[],
  holidays: IHolidaysResponse,
  recentRoles: IRecentRole[] | undefined
}

interface Values {
  selectedMonth: Date;
  changeMonth: (newMonth: Date) => void;
  updateCalendarResources: () => void;
  timeResource: ISuspenseAPI<ITimeBalance>,
  calendarResources: ISuspenseAPI<ICalendarResourcesData>,
  fetchTimeResource: (mode: "by_month" | "by_year" ) => void
}

const CalendarResourcesContext = React.createContext<Values>(null!);

const currentDate = new Date();

const initialTimeResource = wrapPromise(
  CalendarResources.fetchTimeDataByMonth(currentDate)
);
const initialCalendarDataResources = wrapPromise(
  CalendarResources.fetchCalendarData(currentDate)
);

export const CalendarResourcesProvider: React.FC = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentDate);
  const [timeResource, setTimeResource] = useState(initialTimeResource);
  const [calendarResources, setCalendarResources] = useState(
    initialCalendarDataResources
  );

  const updateCalendarResources = () => {
    setTimeResource(
      wrapPromise(CalendarResources.fetchTimeDataByMonth(selectedMonth))
    );
    setCalendarResources(
      wrapPromise(CalendarResources.fetchCalendarData(selectedMonth))
    );
  }

  const changeMonth = (newMonth: Date) => {
    setTimeResource(
      wrapPromise(CalendarResources.fetchTimeDataByMonth(newMonth))
    );
    setCalendarResources(
      wrapPromise(CalendarResources.fetchCalendarData(newMonth))
    );
    setSelectedMonth(newMonth)
  }

  const fetchTimeResource = (mode: "by_month" | "by_year") => {
    const promise = mode === "by_month"
      ? CalendarResources.fetchTimeDataByMonth(selectedMonth)
      : CalendarResources.fetchTimeDataByYear(selectedMonth)

    setTimeResource(wrapPromise(promise));
  }


  return (
    <CalendarResourcesContext.Provider
      value={{
        selectedMonth,
        changeMonth,
        timeResource,
        calendarResources,
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
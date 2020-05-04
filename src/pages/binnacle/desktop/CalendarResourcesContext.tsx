import React, {useContext, useState} from "react"
import {CalendarResources} from "api/CacheSystem/CalendarResources"
import {ITimeBalance} from "api/interfaces/ITimeBalance"
import {IActivityDay} from "api/interfaces/IActivity"
import {IHolidaysResponse} from "api/interfaces/IHolidays"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {ISuspenseAPI, wrapPromise} from "api/CacheSystem/SuspenseAPI"

interface IActivitiesResources {
  activities: IActivityDay[],
  recentRoles: IRecentRole[] | undefined
}

interface Values {
  selectedMonth: Date;
  changeMonth: (newMonth: Date) => void;
  updateCalendarResources: () => void;
  timeResource: ISuspenseAPI<ITimeBalance>,
  holidaysResource: ISuspenseAPI<IHolidaysResponse>
  activitiesResources: ISuspenseAPI<IActivitiesResources>,
  fetchTimeResource: (mode: "by_month" | "by_year" ) => void
}

const CalendarResourcesContext = React.createContext<Values>(null!);

const currentDate = new Date();

const initialTimeResource = wrapPromise(
  CalendarResources.fetchTimeDataByMonth(currentDate)
);

const initialHolidaysResource = wrapPromise(
  CalendarResources.fetchHolidays(currentDate)
);

const initialCalendarDataResources = wrapPromise(
  CalendarResources.fetchActivities(currentDate)
);

export const CalendarResourcesProvider: React.FC = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentDate);
  const [timeResource, setTimeResource] = useState(initialTimeResource);
  const [holidaysResource, setHolidaysResource] = useState(initialHolidaysResource);
  const [activitiesResources, setActivitiesResources] = useState(
    initialCalendarDataResources
  );

  const updateCalendarResources = () => {
    setTimeResource(
      wrapPromise(CalendarResources.fetchTimeDataByMonth(selectedMonth))
    );
    setHolidaysResource(wrapPromise(CalendarResources.fetchHolidays(selectedMonth)))
    setActivitiesResources(
      wrapPromise(CalendarResources.fetchActivities(selectedMonth))
    );
  }

  const changeMonth = (newMonth: Date) => {
    setTimeResource(
      wrapPromise(CalendarResources.fetchTimeDataByMonth(newMonth))
    );
    setHolidaysResource(wrapPromise(CalendarResources.fetchHolidays(newMonth)))
    setActivitiesResources(
      wrapPromise(CalendarResources.fetchActivities(newMonth))
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
        holidaysResource,
        activitiesResources,
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
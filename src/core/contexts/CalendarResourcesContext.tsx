import React, {useContext, useState} from "react"
import {CalendarResourcesService} from "services/CalendarResourcesService"
import {ITimeBalance} from "api/interfaces/ITimeBalance"
import {IActivityDay} from "api/interfaces/IActivity"
import {IHolidaysResponse} from "api/interfaces/IHolidays"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {ISuspenseAPI, wrapPromise} from "api/SuspenseAPI"

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

export const CalendarResourcesContext = React.createContext<Values>(null!);

const currentDate = new Date();

const initialTimeResource = wrapPromise(
  CalendarResourcesService.fetchTimeDataByMonth(currentDate)
);

const initialHolidaysResource = wrapPromise(
  CalendarResourcesService.fetchHolidays(currentDate)
);

const initialCalendarDataResources = wrapPromise(
  CalendarResourcesService.fetchActivities(currentDate)
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
      wrapPromise(CalendarResourcesService.fetchTimeDataByMonth(selectedMonth))
    );
    setHolidaysResource(wrapPromise(CalendarResourcesService.fetchHolidays(selectedMonth)))
    setActivitiesResources(
      wrapPromise(CalendarResourcesService.fetchActivities(selectedMonth))
    );
  }

  const changeMonth = (newMonth: Date) => {
    setTimeResource(
      wrapPromise(CalendarResourcesService.fetchTimeDataByMonth(newMonth))
    );
    setHolidaysResource(wrapPromise(CalendarResourcesService.fetchHolidays(newMonth)))
    setActivitiesResources(
      wrapPromise(CalendarResourcesService.fetchActivities(newMonth))
    );
    setSelectedMonth(newMonth)
  }

  const fetchTimeResource = (mode: "by_month" | "by_year") => {
    const promise = mode === "by_month"
      ? CalendarResourcesService.fetchTimeDataByMonth(selectedMonth)
      : CalendarResourcesService.fetchTimeDataByYear(selectedMonth)

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
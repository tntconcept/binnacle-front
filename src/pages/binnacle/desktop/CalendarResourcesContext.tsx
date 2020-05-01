import React, {useContext, useState} from "react"
import {CalendarResources, wrapPromise} from "api/CacheSystem/CalendarResources"

interface Values {
  selectedMonth: Date;
  changeMonth: (newMonth: Date) => void;
  timeResource: any,
  calendarResources: any,
}

// mutationQueue
// addActivity: (activity: Activity) => void
// updateActivity: (activity: Activity) => void

const CalendarResourcesContext = React.createContext<Values>(null!);

const currentDate = new Date();

const initialTimeResource = wrapPromise(
  CalendarResources.fetchTimeData(currentDate)
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

  const changeMonth = (newMonth: Date) => {
    setTimeResource(
      wrapPromise(CalendarResources.fetchTimeData(newMonth))
    );
    setCalendarResources(
      wrapPromise(CalendarResources.fetchCalendarData(newMonth))
    );
    setSelectedMonth(newMonth)
  }

  return (
    <CalendarResourcesContext.Provider
      value={{
        selectedMonth,
        changeMonth,
        timeResource,
        calendarResources
      }}
    >
      {children}
    </CalendarResourcesContext.Provider>
  );
};

export const useCalendarResources = () => {
  return useContext(CalendarResourcesContext)
}
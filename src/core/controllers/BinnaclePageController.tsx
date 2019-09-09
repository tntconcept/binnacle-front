import React, { useCallback, useContext, useEffect, useState } from "react";
import { NotificationsContext } from "core/contexts/NotificationsContext";
import { getActivitiesBetweenDate } from "services/activitiesService";
import { getHolidaysBetweenDate } from "services/holidaysService";
import {
  firstDayOfFirstWeekOfMonth,
  lastDayOfLastWeekOfMonth
} from "utils/calendarUtils";
import {
  getTimeBalanceBetweenDate,
  ITimeTracker
} from "services/timeTrackingService";
import {
  endOfMonth,
  getMonth,
  isSameMonth,
  startOfMonth,
  subDays
} from "date-fns";
import { UserProvider } from "core/contexts/UserContext";
import { SelectedMonthContext } from "core/contexts/BinnaclePageContexts/SelectedMonthContext";
import { TimeStatsContext } from "core/contexts/BinnaclePageContexts/TimeStatsContext";
import {
  CalendarDataContext,
  CalendarInfo
} from "core/contexts/BinnaclePageContexts/CalendarDataContext";

const initialTime: ITimeTracker = {
  differenceInMinutes: 0,
  minutesToWork: 0,
  minutesWorked: 0
};

const initialDate = new Date();

export const getCalendarInformation = async (month: Date) => {
  const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
  const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);

  const isTimeCalculatedByYear = true;

  const lastValidDate = !isSameMonth(new Date(), month)
    ? endOfMonth(month)
    : subDays(new Date(), 1);

  return await Promise.all([
    getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
    getHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
    getTimeBalanceBetweenDate(startOfMonth(month), lastValidDate)
  ]);
};

const BinnaclePageController: React.FC = props => {
  const addNotification = useContext(NotificationsContext);
  const [loadingPage, setLoadingPage] = useState(true);

  const [selectedMonth, changeSelectedMonth] = useState(initialDate);

  // Todo implement fetch by month and year in TimeStatsControls Component

  const [timeStats, updateTimeStats] = useState(initialTime);

  const [calendarData, updateCalendarData] = useState<
    CalendarInfo | undefined
  >();

  const fetchMonth = useCallback(
    async (month: Date) => {
      try {
        const [activities, holidays, time] = await getCalendarInformation(
          month
        );

        updateTimeStats(time.data[getMonth(month) + 1]);

        updateCalendarData({
          activities: activities.data,
          holidays: holidays.data
        });
        changeSelectedMonth(month);
      } catch (error) {
        addNotification(error!);
      }
    },
    [addNotification]
  );

  useEffect(() => {
    console.count("UseEffect fetch all");
    fetchMonth(initialDate).then(_ => setLoadingPage(false));
  }, [fetchMonth]);

  return (
    <SelectedMonthContext.Provider
      value={{
        selectedMonth,
        changeSelectedMonth: fetchMonth
      }}
    >
      <TimeStatsContext.Provider
        value={{
          timeStats,
          updateTimeStats
        }}
      >
        <CalendarDataContext.Provider
          value={{
            calendarData: calendarData!,
            updateCalendarData
          }}
        >
          {loadingPage === false && props.children}
        </CalendarDataContext.Provider>
      </TimeStatsContext.Provider>
    </SelectedMonthContext.Provider>
  );
};

export default BinnaclePageController;

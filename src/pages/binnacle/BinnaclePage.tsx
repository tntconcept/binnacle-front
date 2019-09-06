import React, { useCallback, useContext, useEffect, useState } from "react";
import DesktopCalendarHeaderLayout from "desktop/layouts/calendar/DesktopCalendarHeaderLayout";
import DesktopTimeTrackingLayout from "desktop/layouts/calendar/DesktopTimeTrackingLayout";
import DesktopCalendarControlsLayout from "desktop/layouts/calendar/DesktopCalendarControlsLayout";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import DesktopCalendarBodyLayout from "desktop/layouts/calendar/DesktopCalendarBodyLayout";
import { SelectedMonthProvider } from "core/contexts/SelectedMonthContext";
import {
  getActivitiesBetweenDate,
  IActivityResponse
} from "services/activitiesService";
import {
  firstDayOfFirstWeekOfMonth,
  lastDayOfLastWeekOfMonth
} from "utils/calendarUtils";
import {
  getTimeBalanceBetweenDate,
  ITimeTracker
} from "services/timeTrackingService";

import { UserProvider } from "core/contexts/UserContext";
import {
  getHolidaysBetweenDate,
  IHolidayResponse
} from "services/holidaysService";
import {
  endOfMonth,
  getDate,
  getMonth,
  isSameMonth,
  startOfMonth
} from "date-fns";
import { NotificationsContext } from "core/contexts/NotificationsContext";

const Button = styled(
  "button",
  cssToObject(`
  border-radius: 5px;
  background-color: var(--autentia-color);
  font-size: 14px;
  line-height: 1.36;
  color: white;
`)
);

const initialTime: ITimeTracker = {
  differenceInMinutes: 0,
  minutesToWork: 0,
  minutesWorked: 0
};

const initialDate = new Date();

interface IBinnaclePageProps {
  activities: IActivityResponse[];
  timeTracking: ITimeTracker;
  holidays: IHolidayResponse;
  fetchRequests(month: Date): Promise<void>;
  selectedMonth: Date;
  setSelectedMonth(month: Date): void;
}

const BinnaclePage: React.FC<IBinnaclePageProps> = props => {
  return (
    <div>
      <SelectedMonthProvider>
        <DesktopCalendarHeaderLayout>
          <DesktopTimeTrackingLayout time={props.timeTracking} />
          <DesktopCalendarControlsLayout
            selectedMonth={props.selectedMonth}
            changeSelectedMonth={props.setSelectedMonth}
            fetchRequests={props.fetchRequests}
          />
          <Button>+ Today</Button>
        </DesktopCalendarHeaderLayout>
        <DesktopCalendarBodyLayout
          selectedMonth={props.selectedMonth}
          activities={props.activities}
          holidays={props.holidays}
        />
      </SelectedMonthProvider>
    </div>
  );
};

const UserProviderLoading: React.FC = props => {
  const addNotification = useContext(NotificationsContext);

  const [loadingPage, setLoadingPage] = useState(true);
  const [time, setTime] = useState(initialTime);
  const [activities, setActivities] = useState<IActivityResponse[]>([]);
  const [holidays, setHolidays] = useState<IHolidayResponse | undefined>();
  const [selectedMonth, setSelectedMonth] = useState(initialDate);

  const fetchData = useCallback(
    async (month: Date) => {
      const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
      const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);
      try {
        const [activities, holidays, time] = await Promise.all([
          getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
          getHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
          getTimeBalanceBetweenDate(startOfMonth(month), endOfMonth(month))
        ]);

        setTime(time.data[getMonth(month) + 1]);
        setActivities(activities.data);
        setHolidays(holidays.data);
      } catch (error) {
        addNotification(error!);
      }
    },
    [addNotification]
  );

  useEffect(() => {
    console.count("UseEffect fetch all");
    fetchData(initialDate).then(_ => setLoadingPage(false));
  }, [fetchData]);

  return (
    <UserProvider>
      {!loadingPage && (
        <BinnaclePage
          activities={activities}
          timeTracking={time}
          holidays={holidays!}
          fetchRequests={fetchData}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      )}
    </UserProvider>
  );
};

export default UserProviderLoading;

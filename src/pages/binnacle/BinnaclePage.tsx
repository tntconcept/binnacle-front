import React, { useState } from "react";
import DesktopCalendarHeaderLayout from "desktop/layouts/calendar/DesktopCalendarHeaderLayout";
import DesktopTimeTrackingLayout from "desktop/layouts/calendar/DesktopTimeTrackingLayout";
import DesktopCalendarControlsLayout from "desktop/layouts/calendar/DesktopCalendarControlsLayout";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import DesktopCalendarBodyLayout from "desktop/layouts/calendar/DesktopCalendarBodyLayout";
import { SelectedMonthProvider } from "core/contexts/SelectedMonthContext";
import { getActivitiesBetweenDate } from "services/activitiesService";
import {
  firstDayOfFirstWeekOfMonth,
  lastDayOfLastWeekOfMonth
} from "utils/calendarUtils";
import { ITimeTracker } from "services/timeTrackingService";

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

const BinnaclePage: React.FC = () => {
  const [time, setTime] = useState(initialTime);

  return (
    <div>
      <SelectedMonthProvider>
        <DesktopCalendarHeaderLayout>
          <DesktopTimeTrackingLayout time={time} />
          <DesktopCalendarControlsLayout handleTime={setTime} />
          <Button>+ Today</Button>
        </DesktopCalendarHeaderLayout>
        <DesktopCalendarBodyLayout />
      </SelectedMonthProvider>
    </div>
  );
};

export default BinnaclePage;

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

const BinnaclePage: React.FC = () => {
  return (
    <div>
      <SelectedMonthProvider>
        <DesktopCalendarHeaderLayout>
          <DesktopTimeTrackingLayout />
          <DesktopCalendarControlsLayout />
          <Button>+ Today</Button>
        </DesktopCalendarHeaderLayout>
        <DesktopCalendarBodyLayout />
      </SelectedMonthProvider>
    </div>
  );
};

export default BinnaclePage;

import React from "react";
import CalendarBarLayout from "desktop/layouts/CalendarBarLayout";
import DesktopTimeStatsLayout from "desktop/layouts/DesktopTimeStatsLayout";
import DesktopCalendarControlsLayout from "desktop/layouts/DesktopTimeControlsLayout";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import CalendarGridLayout from "desktop/layouts/calendar/CalendarGridLayout";

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
      <CalendarBarLayout>
        <DesktopTimeStatsLayout />
        <DesktopCalendarControlsLayout />
        <Button>+ Today</Button>
      </CalendarBarLayout>
      <CalendarGridLayout />
    </div>
  );
};

export default BinnaclePage;

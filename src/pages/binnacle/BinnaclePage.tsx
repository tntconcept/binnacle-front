import React from "react";
import CalendarBarLayout from "desktop/layouts/CalendarBarLayout";
import DesktopTimeStatsLayout from "desktop/layouts/DesktopTimeStatsLayout";
import DesktopCalendarControlsLayout from "desktop/layouts/DesktopMonthControls";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import CalendarGridLayout from "desktop/layouts/calendar/CalendarGridLayout";
import { SelectedMonthProvider } from "core/contexts/SelectedMonthContext";

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
        <CalendarBarLayout>
          <DesktopTimeStatsLayout />
          <DesktopCalendarControlsLayout />
          <Button>+ Today</Button>
        </CalendarBarLayout>
        <CalendarGridLayout />
      </SelectedMonthProvider>
    </div>
  );
};

export default BinnaclePage;

import React from "react";
import DesktopCalendarHeaderLayout from "desktop/layouts/calendar/DesktopCalendarHeaderLayout";
import DesktopTimeStatsLayout from "desktop/layouts/calendar/DesktopTimeStatsLayout";
import DesktopCalendarControlsLayout from "desktop/layouts/calendar/DesktopCalendarControlsLayout";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import DesktopCalendarBodyLayout from "desktop/layouts/calendar/DesktopCalendarBodyLayout";
import BinnaclePageController from "core/controllers/BinnaclePageController";
import MobileBinnacleLayout from "mobile/layouts/calendar/MobileBinnacleLayout";

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

const BinnaclePage: React.FC = props => {
  /*  return (
    <BinnaclePageController>
      <DesktopCalendarHeaderLayout>
        <DesktopTimeStatsLayout />
        <DesktopCalendarControlsLayout />
        <Button>+ Today</Button>
      </DesktopCalendarHeaderLayout>
      <DesktopCalendarBodyLayout />
    </BinnaclePageController>
  );*/

  return <MobileBinnacleLayout />;
};

export default BinnaclePage;

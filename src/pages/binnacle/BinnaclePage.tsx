import React from "react";
import DesktopTimeStatsLayout from "desktop/layouts/calendar/DesktopTimeStatsLayout";
import DesktopCalendarControlsLayout from "desktop/layouts/calendar/DesktopCalendarControlsLayout";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import DesktopCalendarBodyLayout from "desktop/layouts/calendar/DesktopCalendarBodyLayout";
import BinnaclePageController from "core/controllers/BinnaclePageController";
import MobileBinnacleLayout from "mobile/layouts/calendar/MobileBinnacleLayout";
import Media from "react-media";

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

const Header = styled(
  "section",
  cssToObject(`
  display: flex;
  border: none;
  align-items: center;
  justify-content: space-between;
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 16px;
`)
);

const BinnaclePage: React.FC = props => {
  return (
    <Media query="(max-width: 480px)">
      {matches => {
        return matches ? (
          <MobileBinnacleLayout />
        ) : (
          <BinnaclePageController>
            <Header aria-label="Calendar controls">
              <DesktopTimeStatsLayout />
              <DesktopCalendarControlsLayout />
              <Button>+ Today</Button>
            </Header>
            <DesktopCalendarBodyLayout />
          </BinnaclePageController>
        );
      }}
    </Media>
  );
};

export default BinnaclePage;

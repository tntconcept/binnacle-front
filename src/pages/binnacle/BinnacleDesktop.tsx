import React, {Fragment} from "react"
import Navbar from "features/Navbar/Navbar"
import CalendarDesktop from "features/CalendarDesktop"
import SkipNavLink from "core/components/SkipNavLink"

const BinnacleDesktop: React.FC = () => {
  return (
    <Fragment>
      <SkipNavLink contentId='calendar-content' />
      <Navbar />
      <CalendarDesktop />
    </Fragment>
  );
};

export default BinnacleDesktop

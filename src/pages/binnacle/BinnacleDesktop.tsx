import React, {Fragment} from "react"
import Navbar from "core/components/Navbar"
import CalendarDesktop from "pages/binnacle/desktop"
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

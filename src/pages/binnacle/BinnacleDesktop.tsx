import React, {Fragment} from "react"
import Navbar from "core/components/Navbar"
import CalendarDesktop from "pages/binnacle/desktop"

const BinnacleDesktop: React.FC = () => {
  return (
    <Fragment>
      <Navbar />
      <CalendarDesktop />
    </Fragment>
  );
};

export default BinnacleDesktop

import React, { Fragment } from 'react'
import Navbar from 'features/Navbar/Navbar'
import CalendarDesktop from 'pages/binnacle/CalendarDesktop'
import SkipNavLink from 'features/Navbar/SkipNavLink'

const BinnacleDesktop: React.FC = () => {
  return (
    <Fragment>
      <SkipNavLink contentId="calendar-content" />
      <Navbar />
      <CalendarDesktop />
    </Fragment>
  )
}

export default BinnacleDesktop

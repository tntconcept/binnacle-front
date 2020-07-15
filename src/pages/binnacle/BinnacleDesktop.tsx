import React, { Fragment } from 'react'
import Navbar from 'features/Navbar/Navbar'
import { BinnacleDesktopLayout } from 'pages/binnacle/BinnacleDesktopLayout'
import SkipNavLink from 'features/Navbar/SkipNavLink'

const BinnacleDesktop: React.FC = () => {
  return (
    <Fragment>
      <SkipNavLink contentId="calendar-content" />
      <Navbar />
      <BinnacleDesktopLayout />
    </Fragment>
  )
}

export default BinnacleDesktop

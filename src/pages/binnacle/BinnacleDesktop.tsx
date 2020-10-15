import React, { Fragment } from 'react'
import Navbar from 'core/features/Navbar/Navbar'
import { BinnacleDesktopLayout } from 'pages/binnacle/BinnacleDesktopLayout/BinnacleDesktopLayout'
import SkipNavLink from 'core/features/Navbar/SkipNavLink'

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

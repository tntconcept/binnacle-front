import React from 'react'
import { useAuthentication } from 'core/features/Authentication/Authentication'
import MobileNavbar from 'core/features/Navbar/MobileNavbar'
import { useIsMobile } from 'core/hooks'
import { DesktopNavbar } from 'core/features/Navbar/DesktopNavbar'

const Navbar: React.FC = () => {
  const auth = useAuthentication()
  const isMobile = useIsMobile()

  return auth.isAuthenticated ? isMobile ? <MobileNavbar /> : <DesktopNavbar /> : null
}

export default Navbar

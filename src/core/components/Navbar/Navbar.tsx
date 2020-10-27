import React from 'react'
import { useAuthentication } from 'core/providers/AuthenticationProvider'
import MobileNavbar from 'core/components/Navbar/MobileNavbar'
import { useIsMobile } from 'core/hooks'
import { DesktopNavbar } from 'core/components/Navbar/DesktopNavbar'

const Navbar: React.FC = () => {
  const auth = useAuthentication()
  const isMobile = useIsMobile()

  return auth.isAuthenticated ? isMobile ? <MobileNavbar /> : <DesktopNavbar /> : null
}

export default Navbar

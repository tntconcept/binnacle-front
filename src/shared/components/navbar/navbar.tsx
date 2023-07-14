import { useMemo } from 'react'
import { useMatch } from 'react-router-dom'
import { DesktopNavbar } from './desktop-navbar'
import { MobileNavbar } from './mobile-navbar'
import { useAuthContext } from '../../contexts/auth-context'
import { paths } from '../../router/paths'
import { useIsMobile } from '../../hooks/use-is-mobile'

export const Navbar = () => {
  const { isLoggedIn } = useAuthContext()
  const isMobile = useIsMobile()

  const isCalendarPage = useMatch(paths.calendar) !== null
  const isBinnaclePage = useMatch(paths.binnacle) !== null

  return useMemo(() => {
    if (!isLoggedIn) return null

    if (isMobile && (isCalendarPage || isBinnaclePage)) {
      return null
    }
    if (isMobile) {
      return <MobileNavbar />
    }

    return <DesktopNavbar />
  }, [isLoggedIn, isMobile, isCalendarPage])
}

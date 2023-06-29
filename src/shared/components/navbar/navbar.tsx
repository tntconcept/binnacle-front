import { useMemo } from 'react'
import { useMatch } from 'react-router-dom'
import { DesktopNavbar } from 'shared/components/navbar/desktop-navbar'
import MobileNavbar from 'shared/components/navbar/mobile-navbar'
import { useAuthContext } from 'shared/contexts/auth-context'
import { useIsMobile } from 'shared/hooks'
import { paths } from 'shared/router/paths'

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

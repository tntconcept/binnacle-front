import { useMemo } from 'react'
import { useMatch } from 'react-router-dom'
import { DesktopNavbar } from 'shared/components/Navbar/DesktopNavbar'
import MobileNavbar from 'shared/components/Navbar/MobileNavbar'
import { useAuthContext } from 'shared/contexts/auth-context'
import { useIsMobile } from 'shared/hooks'
import { paths } from 'shared/router/paths'

export const Navbar = () => {
  const { isLoggedIn } = useAuthContext()
  const isMobile = useIsMobile()

  const isBinnaclePage = useMatch(paths.binnacle) !== null

  return useMemo(() => {
    if (!isLoggedIn) return null

    if (isMobile && isBinnaclePage) {
      return null
    }
    if (isMobile) {
      return <MobileNavbar />
    }

    return <DesktopNavbar />
  }, [isLoggedIn, isMobile, isBinnaclePage])
}

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

  if (isLoggedIn) {
    if (isMobile && isBinnaclePage) {
      return null
    } else if (isMobile) {
      return <MobileNavbar />
    } else {
      return <DesktopNavbar />
    }
  } else {
    return null
  }
}

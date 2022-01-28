import { useMatch } from 'react-router-dom'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { DesktopNavbar } from 'shared/components/Navbar/DesktopNavbar'
import MobileNavbar from 'shared/components/Navbar/MobileNavbar'
import { AppState } from 'shared/data-access/state/app-state'
import { useIsMobile } from 'shared/hooks'
import { paths } from 'shared/router/paths'
import { observer } from 'mobx-react'

export const Navbar = observer(() => {
  const { isAuthenticated } = useGlobalState(AppState)
  const isMobile = useIsMobile()

  const isBinnaclePage = useMatch(paths.binnacle) !== null
  const isActivityPage = useMatch(paths.activity) !== null

  if (isAuthenticated) {
    if (isMobile && isBinnaclePage) {
      return null
    } else if (isMobile) {
      return isActivityPage ? null : <MobileNavbar />
    } else {
      return <DesktopNavbar />
    }
  } else {
    return null
  }
})

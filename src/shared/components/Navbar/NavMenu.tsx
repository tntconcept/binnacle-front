import { ChevronDownIcon } from '@chakra-ui/icons'
import { Icon, ListItem, Stack, UnorderedList } from '@chakra-ui/react'
import { BriefcaseIcon, CalendarIcon, CogIcon, LogoutIcon } from '@heroicons/react/solid'
import { LogoutCmd } from 'features/user/application/logout-cmd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { NavItemButton } from 'shared/components/Navbar/NavItemButton'
import { NavItemLink } from 'shared/components/Navbar/NavItemLink'
import { useAuthContext } from 'shared/contexts/auth-context'
import { useResolve } from 'shared/di/use-resolve'
import { paths } from 'shared/router/paths'
import { useIsMobile } from '../../hooks'
import styles from './NavMenu.module.css'

export const NavMenu = () => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { setIsLoggedIn, setCanApproval, canApproval } = useAuthContext()

  const navigate = useNavigate()
  const logoutCmd = useResolve(LogoutCmd)

  const handleLogout = async () => {
    await logoutCmd.execute()
    setIsLoggedIn!(false)
    setCanApproval!(false)
    navigate(paths.login)
  }

  const activePath = (path: string) => {
    return window.location.pathname.replace('/tnt/', '/') === path
  }

  return (
    <Stack
      as={UnorderedList}
      direction={['column', 'row']}
      spacing={[1, 3]}
      align="center"
      styleType="none"
      m={0}
      p={0}
      height="full"
      className={styles.parentMenu}
    >
      <ListItem height={['unset', 'full']} width={['full', 'unset']} position="relative">
        <NavItemLink
          to={paths.binnacle}
          keyboardKey="b"
          icon={<Icon as={CalendarIcon} boxSize={4} mr={1} />}
          isActive={
            activePath(paths.binnacle) ||
            activePath(paths.calendar) ||
            (activePath(paths.pendingActivities) && !isMobile)
          }
        >
          {t('pages.binnacle')}
          {canApproval && (
            <Icon as={ChevronDownIcon} boxSize={4} mr={1} className={styles.arrowIcon} />
          )}
        </NavItemLink>
        {canApproval && (
          <Stack
            as={UnorderedList}
            direction={['column']}
            align="left"
            styleType="none"
            m={0}
            p={0}
            height="fit-content"
            className={styles.submenu}
            display={'none'}
          >
            <ListItem
              height={['unset', 'full']}
              width={['full', 'unset']}
              px={2}
              position="relative"
            >
              <NavItemLink
                to={paths.calendar}
                keyboardKey="c"
                icon={<></>}
                isActive={activePath(paths.calendar)}
                isChild={true}
                px={2}
                py={3}
              >
                {t('pages.calendar')}
              </NavItemLink>
              <NavItemLink
                to={paths.pendingActivities}
                keyboardKey="p"
                icon={<></>}
                isActive={activePath(paths.pendingActivities)}
                isChild={true}
                px={2}
                py={3}
              >
                {t('pages.pending_activities')}
              </NavItemLink>
            </ListItem>
          </Stack>
        )}
      </ListItem>
      <ListItem height={['unset', 'full']} width={['full', 'unset']} position="relative">
        <NavItemLink
          to={paths.vacations}
          keyboardKey="v"
          icon={<Icon as={BriefcaseIcon} boxSize={4} mr={1} />}
          isActive={activePath(paths.vacations)}
        >
          {t('pages.vacations')}
        </NavItemLink>
      </ListItem>
      <ListItem height={['unset', 'full']} width={['full', 'unset']} position="relative">
        <NavItemLink
          to={paths.settings}
          keyboardKey="s"
          icon={<Icon as={CogIcon} boxSize={4} mr={1} />}
          isActive={activePath(paths.settings)}
        >
          {t('pages.settings')}
        </NavItemLink>
      </ListItem>
      <ListItem height={['unset', 'full']} width={['full', 'unset']} position="relative">
        <NavItemButton
          keyboardKey="l"
          icon={<Icon as={LogoutIcon} boxSize={4} mr={1} />}
          onClick={handleLogout}
        >
          Logout
        </NavItemButton>
      </ListItem>
    </Stack>
  )
}

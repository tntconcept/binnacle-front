import { ChevronDownIcon } from '@chakra-ui/icons'
import { Icon, ListItem, Stack, UnorderedList } from '@chakra-ui/react'
import {
  AdjustmentsIcon,
  BriefcaseIcon,
  CalendarIcon,
  CogIcon,
  LogoutIcon
} from '@heroicons/react/solid'
import { LogoutCmd } from 'features/auth/application/logout-cmd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { NavItemButton } from 'shared/components/navbar/nav-item-button'
import { NavItemLink } from 'shared/components/navbar/nav-item-link'
import { useAuthContext } from 'shared/contexts/auth-context'
import { useResolve } from 'shared/di/use-resolve'
import { paths } from 'shared/router/paths'
import { useIsMobile } from '../../hooks'
import styles from './nav-menu.module.css'
import { FC } from 'react'

export const NavMenu: FC = () => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { setIsLoggedIn, setCanApproval, canApproval, canBlock } = useAuthContext()

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
            activePath(paths.activities) ||
            (activePath(paths.pendingActivities) && !isMobile)
          }
        >
          {t('pages.binnacle')}
          <Icon as={ChevronDownIcon} boxSize={4} mr={1} className={styles.arrowIcon} />
        </NavItemLink>
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
          <ListItem height={['unset', 'full']} width={['full', 'unset']} px={2} position="relative">
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
              to={paths.activities}
              keyboardKey="p"
              icon={<></>}
              isActive={activePath(paths.activities)}
              isChild={true}
              px={2}
              py={3}
            >
              {t('pages.activities')}
            </NavItemLink>
            {canApproval && (
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
            )}
          </ListItem>
        </Stack>
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
      {canBlock && (
        <ListItem height={['unset', 'full']} width={['full', 'unset']} position="relative">
          <NavItemLink
            to={'#'}
            keyboardKey=""
            icon={<Icon as={AdjustmentsIcon} boxSize={4} mr={1} />}
            isActive={activePath(paths.projects) && !isMobile}
          >
            {t('pages.administration')}{' '}
            <Icon as={ChevronDownIcon} boxSize={4} mr={1} className={styles.arrowIcon} />
          </NavItemLink>
          <Stack
            as={UnorderedList}
            direction={['column']}
            align="center"
            styleType="none"
            m={0}
            p={15}
            height="fit-content"
            className={styles.submenu}
            display={'none'}
          >
            <ListItem height={['unset', 'full']} width={['full', 'unset']} position="relative">
              <NavItemLink
                to={paths.projects}
                keyboardKey="a"
                icon={<></>}
                isActive={activePath(paths.projects)}
                isChild={true}
              >
                {t('pages.projects')}
              </NavItemLink>
            </ListItem>
          </Stack>
        </ListItem>
      )}
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

import React from 'react'
import { Stack, ListItem, UnorderedList, Icon } from '@chakra-ui/core'
import { NavItemLink } from 'core/components/Navbar/NavItemLink'
import { NavItemButton } from 'core/components/Navbar/NavItemButton'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from 'core/providers/AuthenticationProvider'
import { ReactComponent as CalendarIcon } from 'heroicons/solid/calendar.svg'
import { ReactComponent as BriefcaseIcon } from 'heroicons/solid/briefcase.svg'
import { ReactComponent as SettingsIcon } from 'heroicons/solid/cog.svg'
import { ReactComponent as LogoutIcon } from 'heroicons/solid/logout.svg'

export const NavMenu = () => {
  const { t } = useTranslation()
  const auth = useAuthentication()

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
    >
      <ListItem height={['unset', 'full']} width={['full', 'unset']}>
        <NavItemLink
          to="/binnacle"
          keyboardKey="b"
          icon={<Icon as={CalendarIcon} boxSize={4} mr={1} />}
        >
          {t('pages.binnacle')}
        </NavItemLink>
      </ListItem>
      <ListItem height={['unset', 'full']} width={['full', 'unset']}>
        <NavItemLink
          to="/vacations"
          keyboardKey="v"
          icon={<Icon as={BriefcaseIcon} boxSize={4} mr={1} />}
        >
          {t('pages.vacations')}
        </NavItemLink>
      </ListItem>
      <ListItem height={['unset', 'full']} width={['full', 'unset']}>
        <NavItemLink
          to="/settings"
          keyboardKey="s"
          icon={<Icon as={SettingsIcon} boxSize={4} mr={1} />}
        >
          {t('pages.settings')}
        </NavItemLink>
      </ListItem>
      <ListItem height={['unset', 'full']} width={['full', 'unset']}>
        <NavItemButton
          keyboardKey="l"
          icon={<Icon as={LogoutIcon} boxSize={4} mr={1} />}
          onClick={auth.handleLogout}
        >
          Logout
        </NavItemButton>
      </ListItem>
    </Stack>
  )
}

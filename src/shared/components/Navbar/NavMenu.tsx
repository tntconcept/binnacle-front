import { Icon, ListItem, Stack, UnorderedList } from '@chakra-ui/react'
import { BriefcaseIcon, CalendarIcon, CogIcon, LogoutIcon } from '@heroicons/react/solid'
import { LogoutAction } from 'modules/login/data-access/actions/logout-action'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAction } from 'shared/arch/hooks/use-action'
import { NavItemButton } from 'shared/components/Navbar/NavItemButton'
import { NavItemLink } from 'shared/components/Navbar/NavItemLink'
import { paths } from 'shared/router/paths'

export const NavMenu = () => {
  const { t } = useTranslation()

  const navigate = useNavigate()
  const logout = useAction(LogoutAction)

  const handleLogout = async () => {
    await logout()
    navigate(paths.login)
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
    >
      <ListItem height={['unset', 'full']} width={['full', 'unset']} position="relative">
        <NavItemLink
          to={paths.binnacle}
          keyboardKey="b"
          icon={<Icon as={CalendarIcon} boxSize={4} mr={1} />}
        >
          {t('pages.binnacle')}
        </NavItemLink>
      </ListItem>
      <ListItem height={['unset', 'full']} width={['full', 'unset']} position="relative">
        <NavItemLink
          to={paths.vacations}
          keyboardKey="v"
          icon={<Icon as={BriefcaseIcon} boxSize={4} mr={1} />}
        >
          {t('pages.vacations')}
        </NavItemLink>
      </ListItem>
      <ListItem height={['unset', 'full']} width={['full', 'unset']} position="relative">
        <NavItemLink
          to={paths.settings}
          keyboardKey="s"
          icon={<Icon as={CogIcon} boxSize={4} mr={1} />}
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

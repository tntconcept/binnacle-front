import styles from 'core/features/Navbar/Navbar.module.css'
import { NavLink } from 'react-router-dom'
import { ReactComponent as Logo } from 'assets/icons/logo.svg'
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg'
import { ReactComponent as SettingsIcon } from 'assets/icons/settings.svg'
import { ReactComponent as LogoutIcon } from 'assets/icons/logout.svg'
import React from 'react'
import { useAuthentication } from 'core/features/Authentication/Authentication'
import { useTranslation } from 'react-i18next'
import { Box, Flex, HStack, ListItem, UnorderedList } from '@chakra-ui/core'

export function DesktopNavbar() {
  const { t } = useTranslation()
  const auth = useAuthentication()

  return (
    <Box as="header">
      <Flex
        as="nav"
        height="50px"
        align="center"
        justify="space-between"
        px="8"
        mb="8"
        backdropFilter="blur(30px)"
        boxShadow="0 3px 10px 0 rgba(216, 222, 233, 0.15)"
      >
        <NavLink
          to="/binnacle"
          style={{
            color: 'inherit'
          }}
        >
          <Logo
            style={{
              height: '24px',
              marginTop: '5px'
            }}
          />
        </NavLink>
        <HStack
          as={UnorderedList}
          align="center"
          styleType="none"
          m={0}
          p={0}
          spacing={3}
        >
          <ListItem>
            {/* eslint-disable-next-line jsx-a11y/no-access-key */}
            <NavLink
              className={styles.link}
              to="/binnacle"
              activeClassName={styles.isActive}
              accessKey="b"
            >
              <CalendarIcon className={styles.icon} />
              {t('pages.binnacle')}
            </NavLink>
          </ListItem>
          <ListItem>
            {/* eslint-disable-next-line jsx-a11y/no-access-key */}
            <NavLink
              className={styles.link}
              to="/vacations"
              activeClassName={styles.isActive}
              accessKey="s"
            >
              <SettingsIcon className={styles.icon} />
              {t('pages.vacations')}
            </NavLink>
          </ListItem>
          <ListItem>
            {/* eslint-disable-next-line jsx-a11y/no-access-key */}
            <NavLink
              className={styles.link}
              to="/settings"
              activeClassName={styles.isActive}
              accessKey="s"
            >
              <SettingsIcon className={styles.icon} />
              {t('pages.settings')}
            </NavLink>
          </ListItem>
          <ListItem>
            {/* eslint-disable-next-line jsx-a11y/no-access-key */}
            <button
              className={styles.button}
              onClick={auth.handleLogout}
              accessKey="l"
            >
              <LogoutIcon className={styles.icon} />
              <span>Logout</span>
            </button>
          </ListItem>
        </HStack>
      </Flex>
    </Box>
  )
}

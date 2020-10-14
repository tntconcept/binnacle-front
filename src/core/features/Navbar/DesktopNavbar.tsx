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
        // @ts-ignore
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
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
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

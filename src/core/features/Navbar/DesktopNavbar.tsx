import styles from 'core/features/Navbar/Navbar.module.css'
import { NavLink } from 'react-router-dom'
import { ReactComponent as Logo } from 'assets/icons/logo.svg'
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
        // backdropFilter="blur(30px)"
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

        <HStack as={UnorderedList} align="center" styleType="none" m={0} p={0} spacing={3}>
          <ListItem>
            {/* eslint-disable-next-line jsx-a11y/no-access-key */}
            <NavLink
              className={styles.link}
              to="/binnacle"
              activeClassName={styles.isActive}
              accessKey="b"
            >
              <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
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
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
            <button className={styles.button} onClick={auth.handleLogout} accessKey="l">
              <LogoutIcon className={styles.icon} />
              <span>Logout</span>
            </button>
          </ListItem>
        </HStack>
      </Flex>
    </Box>
  )
}

import styles from 'core/features/Navbar/Navbar.module.css'
import { NavLink } from 'react-router-dom'
import { ReactComponent as Logo } from 'assets/icons/logo.svg'
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg'
import { ReactComponent as SettingsIcon } from 'assets/icons/settings.svg'
import { ReactComponent as LogoutIcon } from 'assets/icons/logout.svg'
import React from 'react'
import { useAuthentication } from 'core/features/Authentication/Authentication'
import { useTranslation } from 'react-i18next'

export function DesktopNavbar() {
  const { t } = useTranslation()
  const auth = useAuthentication()

  return (
    <header>
      <nav className={styles.navbar}>
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
        <ul className={styles.links}>
          <li>
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
          </li>
          <li>
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
          </li>
          <li>
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
          </li>
          <li>
            {/* eslint-disable-next-line jsx-a11y/no-access-key */}
            <button
              className={styles.button}
              onClick={auth.handleLogout}
              accessKey="l"
            >
              <LogoutIcon className={styles.icon} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

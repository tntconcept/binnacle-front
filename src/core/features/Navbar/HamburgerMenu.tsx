import React from 'react'
import style from 'core/features/Navbar/HamburgerMenu.module.css'
import { ReactComponent as Settings } from 'heroicons/outline/cog.svg'
import { ReactComponent as Calendar } from 'heroicons/outline/calendar.svg'
import { ReactComponent as Logout } from 'heroicons/outline/logout.svg'
import { Link, NavLink } from 'react-router-dom'
import HamburgerMenuItem from 'core/features/Navbar/HamburgerMenuItem'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from 'core/features/Authentication/Authentication'
import styles from 'core/features/Navbar/Navbar.module.css'

export const HamburgerMenu = () => {
  const { t } = useTranslation()
  const auth = useAuthentication()

  const pathname = window.location.pathname

  return (
    <ul className={style.menu}>
      <HamburgerMenuItem isActive={pathname === '/binnacle'}>
        <Link to="/binnacle" className={style.link}>
          <Calendar
            style={{
              width: '30px',
              marginRight: '8px'
            }}
          />
          {t('pages.binnacle')}
        </Link>
      </HamburgerMenuItem>
      <HamburgerMenuItem isActive={pathname === '/vacations'}>
        <Link to="/vacations" className={style.link}>
          <svg
            style={{
              width: '30px',
              marginRight: '8px'
            }}
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
        </Link>
      </HamburgerMenuItem>
      <HamburgerMenuItem isActive={pathname === '/settings'}>
        <Link to="/settings" className={style.link}>
          <Settings
            style={{
              width: '30px',
              marginRight: '8px'
            }}
          />
          {t('pages.settings')}
        </Link>
      </HamburgerMenuItem>
      <HamburgerMenuItem isActive={false}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={() => auth.handleLogout()} className={style.link}>
          <Logout
            style={{
              width: '30px',
              marginRight: '10px'
            }}
          />
          Logout
        </a>
      </HamburgerMenuItem>
    </ul>
  )
}

export default HamburgerMenu

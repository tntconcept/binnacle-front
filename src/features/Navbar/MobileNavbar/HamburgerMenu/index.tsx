import React from 'react'
import style from 'features/Navbar/MobileNavbar/HamburgerMenu/HamburgerMenu.module.css'
import { ReactComponent as Settings } from 'assets/icons/settings.svg'
import { ReactComponent as Calendar } from 'assets/icons/calendar.svg'
import { ReactComponent as Logout } from 'assets/icons/logout.svg'
import { Link } from 'react-router-dom'
import HamburgerMenuItem from 'features/Navbar/MobileNavbar/HamburgerMenu/HamburgerMenuItem'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from 'features/Authentication'

export const HamburgerMenu = () => {
  const { t } = useTranslation()
  const auth = useAuthentication()

  const pathname = window.location.pathname

  return (
    <ul className={style.menu}>
      <HamburgerMenuItem isActive={pathname === '/binnacle'}>
        <Link
          to="/binnacle"
          className={style.link}>
          <Calendar
            style={{
              width: '30px',
              marginRight: '8px'
            }}
          />
          {t('pages.binnacle')}
        </Link>
      </HamburgerMenuItem>
      <HamburgerMenuItem isActive={pathname === '/settings'}>
        <Link
          to="/settings"
          className={style.link}>
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
        <a
          href="#"
          onClick={() => auth.handleLogout()}
          className={style.link}>
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

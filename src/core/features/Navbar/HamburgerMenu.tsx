import React from 'react'
import style from 'core/features/Navbar/HamburgerMenu.module.css'
import { ReactComponent as Settings } from 'assets/icons/settings.svg'
import { ReactComponent as Calendar } from 'assets/icons/calendar.svg'
import { ReactComponent as Logout } from 'assets/icons/logout.svg'
import { Link } from 'react-router-dom'
import HamburgerMenuItem from 'core/features/Navbar/HamburgerMenuItem'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from 'core/features/Authentication/Authentication'

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
          <Settings
            style={{
              width: '30px',
              marginRight: '8px'
            }}
          />
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

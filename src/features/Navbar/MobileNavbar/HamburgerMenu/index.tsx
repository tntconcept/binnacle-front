import React from "react"
import style from "features/Navbar/MobileNavbar/HamburgerMenu/HamburgerMenu.module.css"
import {ReactComponent as Settings} from "assets/icons/settings.svg"
import {ReactComponent as Calendar} from "assets/icons/calendar.svg"
import {ReactComponent as Logout} from "assets/icons/logout.svg"
import {Link} from "react-router-dom"
import HamburgerMenuItem from "features/Navbar/MobileNavbar/HamburgerMenu/HamburgerMenuItem"
import {useTranslation} from "react-i18next"
import {useAuthentication} from "features/Authentication"

export const HamburgerMenu = () => {
  const { t } = useTranslation()
  const auth = useAuthentication()

  const pathname = window.location.pathname

  return (
    <ul className={style.menu}>
      <HamburgerMenuItem
        isActive={pathname === "/binnacle"}
      >
        <Calendar
          style={{
            width: "30px",
            marginRight: "8px"
          }}
        />
        <Link to="/binnacle">
          {t("pages.binnacle")}
        </Link>
      </HamburgerMenuItem>
      <HamburgerMenuItem
        isActive={pathname === "/settings"}
      >
        <Settings
          style={{
            width: "30px",
            marginRight: "8px"
          }}
        />
        <Link to="/settings">
          {t("pages.settings")}
        </Link>
      </HamburgerMenuItem>
      <HamburgerMenuItem
        isActive={false}
      >
        <Logout
          style={{
            width: "30px",
            marginRight: "10px",
          }}
        />
        <a
          href='#'
          onClick={() => auth.handleLogout()}>
          Logout
        </a>
      </HamburgerMenuItem>
    </ul>
  );
}

export default HamburgerMenu


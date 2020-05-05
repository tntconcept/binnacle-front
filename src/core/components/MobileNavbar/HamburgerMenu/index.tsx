import React, {useContext} from "react"
import style from "core/components/MobileNavbar/HamburgerMenu/HamburgerMenu.module.css"
import {ReactComponent as Settings} from "assets/icons/settings.svg"
import {ReactComponent as Calendar} from "assets/icons/calendar.svg"
import {ReactComponent as Logout} from "assets/icons/logout.svg"
import {Link} from "react-router-dom"
import {AuthContext} from "core/contexts/AuthContext"
import HamburgerMenuItem from "core/components/MobileNavbar/HamburgerMenu/HamburgerMenuItem"
import {useTranslation} from "react-i18next"

export const HamburgerMenu = () => {
  const { t } = useTranslation()
  const auth = useContext(AuthContext)

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


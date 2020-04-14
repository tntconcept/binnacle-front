import React, {useContext} from "react"
import style from "core/components/MobileNavbar/HamburgerMenu/HamburgerMenu.module.css"
import {ReactComponent as Settings} from "assets/icons/settings.svg"
import {ReactComponent as Calendar} from "assets/icons/calendar.svg"
import {ReactComponent as Logout} from "assets/icons/logout.svg"
import {useHistory} from "react-router-dom"
import {AuthContext} from "core/contexts/AuthContext"
import HamburgerSidebar from "core/components/MobileNavbar/HamburgerMenu/HamburgerSidebar"
import HamburgerMenuItem from "core/components/MobileNavbar/HamburgerMenu/HamburgerMenuItem"
import {useTranslation} from "react-i18next"

export const Menu = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const auth = useContext(AuthContext)
  const pathname = history.location.pathname

  return (
    <ul className={style.menu}>
      <HamburgerMenuItem
        handleClick={
          () => history.push("/binnacle")
        }
        isActive={pathname === "/binnacle"}
      >
        <Calendar
          style={{
            width: "25px",
            marginRight: "10px",
            marginLeft: "2px"
          }}
        />
        {t("pages.binnacle")}
      </HamburgerMenuItem>
      <HamburgerMenuItem
        handleClick={
          () => history.push("/settings")
        }
        isActive={pathname === "/settings"}
      >
        <Settings
          style={{
            width: "30px",
            marginRight: "10px"
          }}
        />
        {t("pages.settings")}
      </HamburgerMenuItem>
      <HamburgerMenuItem
        handleClick={() => auth.handleLogout()}
        isActive={false}
      >
        <Logout
          style={{
            width: "30px",
            marginRight: "10px",
          }}
        />
        Logout
      </HamburgerMenuItem>
    </ul>
  );
}

const HamburgerMenu = () => {
  return (
    <HamburgerSidebar>
      <Menu />
    </HamburgerSidebar>
  )
}

export default HamburgerMenu


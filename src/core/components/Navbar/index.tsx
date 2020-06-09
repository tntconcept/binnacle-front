import React, {useContext} from "react"
import {AuthContext} from "core/contexts/AuthContext"
import {ReactComponent as Logo} from "assets/icons/logo.svg"
import {NavLink} from "react-router-dom"
import styles from "./Navbar.module.css"
import {useTranslation} from "react-i18next"
import {ReactComponent as LogoutIcon} from "assets/icons/logout.svg"
import {ReactComponent as CalendarIcon} from "assets/icons/calendar.svg"
import {ReactComponent as SettingsIcon} from "assets/icons/settings.svg"

import {useMediaQuery} from "react-responsive"
import MobileNavbar from "core/components/MobileNavbar"

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  const isMobile = useMediaQuery({
    query: "(max-width: 480px)"
  });

  return auth.isAuthenticated ? (
    isMobile ? (
      <MobileNavbar />
    ) : (
      <header>
        <nav className={styles.navbar}>
          <NavLink
            to="/binnacle"
            style={{
              color: "inherit"
            }}
          >
            <Logo
              style={{
                height: "24px"
              }}
            />
          </NavLink>
          <ul className={styles.links}>
            <li>
              <NavLink
                className={styles.link}
                to="/binnacle"
                activeClassName={styles.isActive}
                accessKey="b"
              >
                <CalendarIcon className={styles.icon} />
                {t("pages.binnacle")}
              </NavLink>
            </li>
            <li>
              <NavLink
                className={styles.link}
                to="/settings"
                activeClassName={styles.isActive}
                accessKey="s"
              >
                <SettingsIcon className={styles.icon} />
                {t("pages.settings")}
              </NavLink>
            </li>
            <li>
              <button className={styles.button} onClick={auth.handleLogout} accessKey="l">
                <LogoutIcon className={styles.icon} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </header>
    )
  ) : null;
};

export default Navbar;

import React, {useContext} from "react"
import {AuthContext} from "core/contexts/AuthContext"
import {ReactComponent as Logo} from "assets/icons/logo.svg"
import {NavLink} from "react-router-dom"
import styles from './Navbar.module.css'
import {useTranslation} from "react-i18next"
import {ReactComponent as Logout} from "assets/icons/logout.svg"

const Navbar: React.FC = () => {
  const { t } = useTranslation()
  const auth = useContext(AuthContext);

  return auth.isAuthenticated ? (
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
            >
              {t("pages.binnacle")}
            </NavLink>
          </li>
          <li>
            <NavLink
              className={styles.link}
              to="/settings"
              activeClassName={styles.isActive}
            >
              {t("pages.settings")}
            </NavLink>
          </li>
          <li>
            <button
              className={styles.button}
              onClick={auth.handleLogout}>
              <Logout />
              <span style={{marginLeft: 6}}>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  ) : null;
};

export default Navbar;

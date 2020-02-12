import React, {useContext} from "react"
import {AuthContext} from "core/contexts/AuthContext"
import {ReactComponent as Logo} from "assets/icons/logo.svg"
import {NavLink} from "react-router-dom"
import styles from './Navbar.module.css'

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);

  return true ? (
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
              activeStyle={{
                fontWeight: "bold"
              }}
            >
              Binnacle
            </NavLink>
          </li>
          <li>
            <button onClick={auth.handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  ) : null;
};

export default Navbar;

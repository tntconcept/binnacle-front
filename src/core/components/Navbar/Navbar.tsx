import React, {useContext} from "react"
import {AuthContext} from "core/contexts/AuthContext"
import {ReactComponent as Logo} from "assets/icons/logo.svg"
import {NavLink} from "react-router-dom"
import {link, links, navbar} from "core/components/Navbar/style"

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);

  return auth.isAuthenticated ? (
    <header>
      <nav className={navbar}>
        <NavLink to="/binnacle">
          <Logo
            style={{
              height: "24px"
            }}
          />
        </NavLink>
        <ul className={links}>
          <li>
            <NavLink
              className={link}
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

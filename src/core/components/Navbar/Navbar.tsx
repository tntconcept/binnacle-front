import React, { useContext } from "react";
import { AuthContext } from "core/contexts/AuthContext";
import { NavbarStyles as S } from "core/components/Navbar/style";
import { ReactComponent as Logo } from "assets/icons/logo.svg";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);

  return auth.isAuthenticated === false ? (
    <header>
      <S.Navbar>
        <NavLink to="/binnacle">
          <Logo
            style={{
              height: "24px"
            }}
          />
        </NavLink>
        <S.NavLinks>
          <S.NavItem>
            <S.StyledNavLink
              to="/binnacle"
              activeStyle={{
                fontWeight: "bold"
              }}
            >
              Binnacle
            </S.StyledNavLink>
          </S.NavItem>
          <S.NavItem>
            <button onClick={auth.handleLogout}>Logout</button>
          </S.NavItem>
        </S.NavLinks>
      </S.Navbar>
    </header>
  ) : null;
};

export default Navbar;

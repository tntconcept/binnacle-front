import React, { useContext } from "react";
import { AuthContext } from "core/contexts/AuthContext";
import {
  Container,
  Menu,
  MenuItem,
  StyledNavLink
} from "core/components/Navbar/style";

const Navbar: React.FC = props => {
  const auth = useContext(AuthContext);

  return auth.isAuthenticated ? (
    <Container>
      <Menu>
        <MenuItem>
          <StyledNavLink
            to="/login"
            activeStyle={{
              fontWeight: "bold"
            }}
          >
            Login
          </StyledNavLink>
        </MenuItem>
        <MenuItem>
          <StyledNavLink
            to="/binnacle"
            activeStyle={{
              fontWeight: "bold"
            }}
          >
            Binnacle
          </StyledNavLink>
        </MenuItem>
        <MenuItem>
          <button onClick={auth.handleLogout}>Logout</button>
        </MenuItem>
      </Menu>
    </Container>
  ) : null;
};

export default Navbar;

import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import { NavLink } from "react-router-dom";

const Navbar = styled(
  "nav",
  cssToObject(`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(30px);
  box-shadow: 0 3px 10px 0 rgba(216, 222, 233, 0.15);
  background-color: #fbfbfc;
  padding-right: 32px;
  padding-left: 32px;
  margin-bottom: 32px;
`)
);

const NavLinks = styled(
  "ul",
  cssToObject(`
   display: flex;
   align-items: center;
   list-style-type: none;
   padding: 0;
   margin: 0;
`)
);

const NavItem = styled(
  "li",
  cssToObject(`
  
`)
);

const StyledNavLink = styled(
  NavLink,
  cssToObject(`
  display: block;
  color: #162644;
  font-size: 18px;
  font-weight: lighter;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
`)
);

export const NavbarStyles = {
  Navbar,
  NavLinks,
  NavItem,
  StyledNavLink
};

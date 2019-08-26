import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import { NavLink } from "react-router-dom";

export const Container = styled(
  "nav",
  cssToObject(`
  width: 100%;
  height: 50px;
  backdrop-filter: blur(30px);
  box-shadow: 0 3px 10px 0 rgba(216, 222, 233, 0.15);
  background-color: white;
  margin-bottom: 32px;
`)
);

export const Menu = styled(
  "ul",
  cssToObject(`
   display: flex;
   justify-content: center;
   list-style-type: none;
   padding: 0;
   margin: 0;
`)
);

export const MenuItem = styled(
  "li",
  cssToObject(`
  float: left;
`)
);

export const StyledNavLink = styled(
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

import React from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";

const Header = styled(
  "div",
  cssToObject(`
  display: flex;
  border: none;
  align-items: center;
  justify-content: space-between;
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 16px;
`)
);

const DesktopCalendarHeaderLayout: React.FC = props => {
  return <Header>{props.children}</Header>;
};

export default DesktopCalendarHeaderLayout;

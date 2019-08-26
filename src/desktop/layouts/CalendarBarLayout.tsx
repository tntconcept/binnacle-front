import React from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";

const Bar = styled(
  "div",
  cssToObject(`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 32px;
  margin-right: 32px;
`)
);

const CalendarBarLayout: React.FC = props => {
  return <Bar>{props.children}</Bar>;
};

export default CalendarBarLayout;

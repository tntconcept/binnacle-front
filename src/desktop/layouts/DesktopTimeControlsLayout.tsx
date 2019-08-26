import React from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";

const Container = styled(
  "div",
  cssToObject(`
  display: flex;
  align-items: center;
`)
);

const Month = styled(
  "span",
  cssToObject(`
  font-size: 24px;
  font-weight: 900;
  line-height: 1.33;
  color: var(--dark);
`)
);

const Year = styled(
  "span",
  cssToObject(`
  font-size: 24px;
  line-height: 1.33;
  color: var(--dark);
`)
);

const CalendarInfo = styled(
  "p",
  cssToObject(`
   margin-left: 12px;
   margin-right: 12px;
`)
);

const DesktopTimeControlsLayout: React.FC = () => {
  return (
    <Container>
      <button>{"<"}</button>
      <CalendarInfo>
        <Month>JANUARY </Month>
        <Year>2019</Year>
      </CalendarInfo>
      <button>{">"}</button>
    </Container>
  );
};

export default DesktopTimeControlsLayout;

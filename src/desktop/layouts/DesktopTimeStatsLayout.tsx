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

const Box = styled(
  "div",
  cssToObject(`
  display: flex;
  flex-direction: column;
  align-items: center;
`)
);

const Time = styled(
  "p",
  cssToObject(`
  font-size: 14px;
  font-weight: 900;
  line-height: 1.36;
  color: var(--dark);
`)
);

const Description = styled(
  "p",
  cssToObject(`
  font-size: 14px;
  line-height: 1.36;
  color: var(--dark);
`)
);

const Divider = styled(
  "div",
  cssToObject(`
   border-left:1px solid var(--light-blue-grey); 
   height: 26px;
   margin-left: 16px;
   margin-right: 16px;
`)
);

const DesktopTimeStatsLayout = () => {
  return (
    <Container>
      <Box>
        <Time>12h 40m</Time>
        <Description>imputed</Description>
      </Box>
      <Divider />
      <Box>
        <Time>128h</Time>
        <Description>this month</Description>
      </Box>
      <Divider />
      <Box>
        <Time
          style={{
            color: "var(--error-color)"
          }}
        >
          -10h 15m
        </Time>
        <Description>time balance</Description>
      </Box>
    </Container>
  );
};

export default DesktopTimeStatsLayout;

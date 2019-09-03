import React, { useContext } from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import { SelectedMonthContext } from "core/contexts/SelectedMonthContext";
import { ITimeTracker } from "services/timeTrackingService";

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

interface IProps {
  time: ITimeTracker;
}

const calculateColor = (time: number) => {
  if (time === 0) {
    return "black";
  } else if (time > 0) {
    return "green";
  }
  return "var(--error-color)";
};

const DesktopTimeTrackingLayout: React.FC<IProps> = props => {
  return (
    <Container>
      <Box>
        <Time>{props.time.minutesWorked}</Time>
        <Description>imputed</Description>
      </Box>
      <Divider />
      <Box>
        <Time>{props.time.minutesToWork}</Time>
        <Description>this month</Description>
      </Box>
      <Divider />
      <Box>
        <Time
          style={{
            color: calculateColor(props.time.differenceInMinutes)
          }}
        >
          {props.time.differenceInMinutes}
        </Time>
        <Description>time balance</Description>
      </Box>
    </Container>
  );
};

export default DesktopTimeTrackingLayout;

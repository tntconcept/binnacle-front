import React, { useContext } from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import { TimeStatsContext } from "core/contexts/BinnaclePageContexts/TimeStatsContext";

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

const calculateColor = (time: number) => {
  if (time === 0) {
    return "black";
  } else if (time > 0) {
    return "green";
  }
  return "var(--error-color)";
};

const DesktopTimeTrackingLayout: React.FC = () => {
  const { timeStats } = useContext(TimeStatsContext)!;

  return (
    <Container>
      <Box>
        <Time>{timeStats.minutesWorked}</Time>
        <Description>imputed</Description>
      </Box>
      <Divider />
      <Box>
        <Time>{timeStats.minutesToWork}</Time>
        <Description>this month</Description>
      </Box>
      <Divider />
      <Box>
        <Time
          style={{
            color: calculateColor(timeStats.differenceInMinutes)
          }}
        >
          {timeStats.differenceInMinutes}
        </Time>
        <Description>time balance</Description>
      </Box>
      <button>Fetch by month</button>
      <button>Fetch by year</button>
    </Container>
  );
};

export default DesktopTimeTrackingLayout;

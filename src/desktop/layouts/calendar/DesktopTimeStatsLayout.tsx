import React, { useContext, useState } from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import { TimeStatsContext } from "core/contexts/BinnaclePageContexts/TimeStatsContext";
import { SelectedMonthContext } from "core/contexts/BinnaclePageContexts/SelectedMonthContext";
import { getTimeBalanceBetweenDate } from "services/timeTrackingService";
import {
  endOfMonth,
  getMonth,
  isSameMonth,
  startOfMonth,
  startOfYear,
  subDays
} from "date-fns";
import { NotificationsContext } from "core/contexts/NotificationsContext";

const Container = styled(
  "div",
  cssToObject(`
    font-family: 'Nunito Sans';
    font-size: 10px;
    font-weight: 600;
    line-height: 1.4;
    text-align: left;
    color: var(--dark);
    text-transform: uppercase;
  `)
);

const Stats = styled(
  "div",
  cssToObject(`
  display: flex;
  align-items: center;
`)
);

const TimeBlock = styled(
  "div",
  cssToObject(`
  font-family: 'Nunito Sans';
  font-size: 8px;
  line-height: 1.4;
  text-align: left;
  text-transform: uppercase;
  color: var(--dark);
`)
);

const Time = styled(
  "p",
  cssToObject(`
  font-family: 'Nunito Sans';
  font-size: 14px;
  font-weight: bold;
  line-height: 1.4;
  text-align: left;
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

const DesktopTimeStatsLayout: React.FC = () => {
  const [loadingBalance, setLoadingBalance] = useState(false);
  const addNotification = useContext(NotificationsContext);
  const { selectedMonth } = useContext(SelectedMonthContext)!;
  const { timeStats, updateTimeStats } = useContext(TimeStatsContext)!;
  const [selectedBalance, setBalance] = useState("balance mensual");

  const calculateBalanceByYear = async () => {
    setLoadingBalance(true);
    try {
      const yesterdayDate = subDays(new Date(), 1);
      const result = await getTimeBalanceBetweenDate(
        startOfYear(selectedMonth),
        yesterdayDate
      );

      const amountOfMinutes = Object.values(result.data).reduce(
        (t, n) => t + n.differenceInMinutes,
        0
      );

      updateTimeStats({
        ...timeStats,
        differenceInMinutes: amountOfMinutes
      });
    } catch (error) {
      addNotification(error!);
    }
    setLoadingBalance(false);
  };

  const calculateBalanceByMonth = async () => {
    setLoadingBalance(true);
    try {
      const lastValidDate = !isSameMonth(new Date(), selectedMonth)
        ? endOfMonth(selectedMonth)
        : new Date();

      const result = await getTimeBalanceBetweenDate(
        startOfMonth(selectedMonth),
        lastValidDate
      );

      const newTimeStats = result.data[getMonth(selectedMonth) + 1];

      updateTimeStats(newTimeStats);
    } catch (error) {
      console.log(error);
      addNotification(error!);
    }
    setLoadingBalance(false);
  };

  const handleSelect = (event: any) => {
    const optionSelected = event.target.value;

    setBalance(optionSelected);

    if (optionSelected === "balance mensual") {
      calculateBalanceByMonth();
    } else {
      calculateBalanceByYear();
    }
  };

  return (
    <Container>
      seguimiento de horas
      <Stats>
        <TimeBlock>
          imputadas
          <Time>{timeStats.minutesWorked}</Time>
        </TimeBlock>
        <Divider />
        <TimeBlock>
          laborables
          <Time>{timeStats.minutesToWork}</Time>
        </TimeBlock>
        <Divider />
        <TimeBlock>
          <select
            onChange={handleSelect}
            value={selectedBalance}
            style={{
              textTransform: "uppercase",
              fontSize: "8px",
              fontFamily: "Nunito sans"
            }}
          >
            <option data-testid="balance_by_month_button">
              balance mensual
            </option>
            <option data-testid="balance_by_year_button">balance anual</option>
          </select>
          <Time
            style={{
              color: calculateColor(timeStats.differenceInMinutes)
            }}
            data-testid="time_balance_value"
          >
            {loadingBalance ? (
              <span>Loading...</span>
            ) : (
              timeStats.differenceInMinutes
            )}
          </Time>
        </TimeBlock>
      </Stats>
    </Container>
  );
};

export default DesktopTimeStatsLayout;

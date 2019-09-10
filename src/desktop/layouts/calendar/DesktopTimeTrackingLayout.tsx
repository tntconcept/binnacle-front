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
  const [loadingBalance, setLoadingBalance] = useState(false);
  const addNotification = useContext(NotificationsContext);
  const { selectedMonth } = useContext(SelectedMonthContext)!;
  const { timeStats, updateTimeStats } = useContext(TimeStatsContext)!;

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
        : subDays(selectedMonth, 1);

      const result = await getTimeBalanceBetweenDate(
        startOfMonth(selectedMonth),
        lastValidDate
      );

      updateTimeStats(result.data[getMonth(selectedMonth) + 1]);
    } catch (error) {
      addNotification(error!);
    }
    setLoadingBalance(false);
  };

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
          data-testid="time_balance_value"
        >
          {loadingBalance ? (
            <span>Loading...</span>
          ) : (
            timeStats.differenceInMinutes
          )}
        </Time>
        <Description>time balance</Description>
      </Box>
      <button
        onClick={calculateBalanceByMonth}
        data-testid="balance_by_month_button"
      >
        Fetch by month
      </button>
      <button
        onClick={calculateBalanceByYear}
        data-testid="balance_by_year_button"
      >
        Fetch by year
      </button>
    </Container>
  );
};

export default DesktopTimeTrackingLayout;

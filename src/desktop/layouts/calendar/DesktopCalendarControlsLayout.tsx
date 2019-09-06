import React, { useContext, useState } from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import { SelectedMonthContext } from "core/contexts/SelectedMonthContext";
import {
  addMonths,
  endOfMonth,
  format,
  getMonth,
  isFuture,
  isThisMonth,
  startOfMonth,
  subDays,
  subMonths
} from "date-fns";
import {
  firstDayOfFirstWeekOfMonth,
  lastDayOfLastWeekOfMonth
} from "utils/calendarUtils";
import {
  getActivitiesBetweenDate,
  IActivityResponse
} from "services/activitiesService";
import { getHolidaysBetweenDate } from "services/holidaysService";
import {
  getTimeBalanceBetweenDate,
  ITimeTracker
} from "services/timeTrackingService";

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

const CalendarDate = styled(
  "p",
  cssToObject(`
   margin-left: 12px;
   margin-right: 12px;
`)
);

interface IProps {
  selectedMonth: Date;
  changeSelectedMonth(month: Date): void;
  fetchRequests(month: Date): Promise<void>;
}

const DesktopCalendarControlsLayout: React.FC<IProps> = props => {
  const [loadingPrevDate, setLoadingPrevDate] = useState(false);
  const [loadingNextDate, setLoadingNextDate] = useState(false);

  const handleNextMonthClick = async () => {
    setLoadingNextDate(true);
    const nextMonth = addMonths(props.selectedMonth, 1);

    props.fetchRequests(nextMonth).then(_ => {
      props.changeSelectedMonth(nextMonth);
      setLoadingNextDate(false);
    });
  };
  const handlePrevMonthClick = () => {
    setLoadingPrevDate(true);
    const prevMonth = subMonths(props.selectedMonth, 1);

    props.fetchRequests(prevMonth).then(_ => {
      props.changeSelectedMonth(prevMonth);
      setLoadingPrevDate(false);
    });
  };

  return (
    <Container>
      <button onClick={handlePrevMonthClick}>
        {loadingPrevDate ? "loading" : "<"}
      </button>
      <CalendarDate>
        <span>
          <Month>{format(props.selectedMonth, "MMMM")}</Month>{" "}
          <Year>{format(props.selectedMonth, "yyyy")}</Year>
        </span>
      </CalendarDate>
      <button onClick={handleNextMonthClick}>
        {loadingNextDate ? "loading" : ">"}
      </button>
    </Container>
  );
};

export default DesktopCalendarControlsLayout;

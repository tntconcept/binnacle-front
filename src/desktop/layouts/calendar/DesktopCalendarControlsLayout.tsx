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
  handleTime: (time: ITimeTracker) => void;
  handleActivities: (activities: IActivityResponse[]) => void;
}

const DesktopCalendarControlsLayout: React.FC<IProps> = props => {
  const { selectedMonth, changeSelectedMonth } = useContext(
    SelectedMonthContext
  );

  const [loadingPrevDate, setLoadingPrevDate] = useState(false);
  const [loadingNextDate, setLoadingNextDate] = useState(false);

  // const activitiesByMonth = useActivities(selectedMonth) No puede ser aqui porque se lanza la query desde calendar controls

  const handleNextMonthClick = async () => {
    const nextMonth = addMonths(selectedMonth, 1);
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(nextMonth);
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(nextMonth);

    const [activities, holidays, time] = await Promise.all([
      getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      getHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      getTimeBalanceBetweenDate(startOfMonth(nextMonth), endOfMonth(nextMonth))
    ]);

    props.handleTime(time.data[getMonth(nextMonth) + 1]);
    props.handleActivities(activities.data);
    changeSelectedMonth(nextMonth);
  };
  const handlePrevMonthClick = () => {
    const prevMonth = subMonths(selectedMonth, 1);
    changeSelectedMonth(prevMonth);
  };

  return (
    <Container>
      <button onClick={handlePrevMonthClick}>{"<"}</button>
      <CalendarDate>
        <span>
          <Month>{format(selectedMonth, "MMMM")}</Month>{" "}
          <Year>{format(selectedMonth, "yyyy")}</Year>
        </span>
      </CalendarDate>
      <button onClick={handleNextMonthClick}>{">"}</button>
    </Container>
  );
};

export default DesktopCalendarControlsLayout;

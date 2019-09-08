import React, { useContext, useState } from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import { SelectedMonthContext } from "core/contexts/BinnaclePageContexts/SelectedMonthContext";
import { addMonths, format, subMonths } from "date-fns";

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

const DesktopCalendarControlsLayout: React.FC = () => {
  const [loadingPrevDate, setLoadingPrevDate] = useState(false);
  const [loadingNextDate, setLoadingNextDate] = useState(false);

  const { selectedMonth, changeSelectedMonth } = useContext(
    SelectedMonthContext
  )!;

  const handleNextMonthClick = async () => {
    setLoadingNextDate(true);
    const nextMonth = addMonths(selectedMonth, 1);

    changeSelectedMonth(nextMonth).then(_ => {
      setLoadingNextDate(false);
    });
  };
  const handlePrevMonthClick = () => {
    setLoadingPrevDate(true);
    const prevMonth = subMonths(selectedMonth, 1);

    changeSelectedMonth(prevMonth).then(_ => {
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
          <Month>{format(selectedMonth, "MMMM")}</Month>{" "}
          <Year>{format(selectedMonth, "yyyy")}</Year>
        </span>
      </CalendarDate>
      <button onClick={handleNextMonthClick}>
        {loadingNextDate ? "loading" : ">"}
      </button>
    </Container>
  );
};

export default DesktopCalendarControlsLayout;

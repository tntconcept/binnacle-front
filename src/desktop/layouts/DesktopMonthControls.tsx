import React, { useContext } from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import { SelectedMonthContext } from "core/contexts/SelectedMonthContext";
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

const CalendarInfo = styled(
  "p",
  cssToObject(`
   margin-left: 12px;
   margin-right: 12px;
`)
);

const DesktopMonthControls: React.FC = () => {
  const { selectedMonth, changeSelectedMonth } = useContext(
    SelectedMonthContext
  );

  const nextMonth = () => changeSelectedMonth(addMonths(selectedMonth, 1));
  const prevMonth = () => changeSelectedMonth(subMonths(selectedMonth, 1));

  return (
    <Container>
      <button onClick={prevMonth}>{"<"}</button>
      <CalendarInfo>
        <span>
          <Month>{format(selectedMonth, "MMMM")}</Month>{" "}
          <Year>{format(selectedMonth, "yyyy")}</Year>
        </span>
      </CalendarInfo>
      <button onClick={nextMonth}>{">"}</button>
    </Container>
  );
};

export default DesktopMonthControls;

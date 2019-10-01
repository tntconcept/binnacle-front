import React, { useContext, useState } from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import { SelectedMonthContext } from "core/contexts/BinnaclePageContexts/SelectedMonthContext";
import { addMonths, format, subMonths } from "date-fns";
import { NotificationsContext } from "core/contexts/NotificationsContext";
import getErrorMessage from "utils/apiErrorMessage";
import { ReactComponent as ChevronRight } from "assets/icons/chevron-right.svg";
import { ReactComponent as ChevronLeft } from "assets/icons/chevron-left.svg";
import CircleButton from "core/components/Button/CircleButton";

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

const Date = styled(
  "p",
  cssToObject(`
   margin-left: 12px;
   margin-right: 12px;
`)
);

const DesktopCalendarControlsLayout: React.FC = () => {
  const [loadingPrevDate, setLoadingPrevDate] = useState(false);
  const [loadingNextDate, setLoadingNextDate] = useState(false);
  const addNotification = useContext(NotificationsContext);

  const { selectedMonth, changeSelectedMonth } = useContext(
    SelectedMonthContext
  )!;

  const handleNextMonthClick = async () => {
    setLoadingNextDate(true);
    try {
      const nextMonth = addMonths(selectedMonth, 1);
      await changeSelectedMonth(nextMonth);
    } catch (error) {
      addNotification(getErrorMessage(error)!);
    }

    setLoadingNextDate(false);
  };

  const handlePrevMonthClick = async () => {
    setLoadingPrevDate(true);

    try {
      const prevMonth = subMonths(selectedMonth, 1);
      await changeSelectedMonth(prevMonth);
    } catch (error) {
      addNotification(getErrorMessage(error)!);
    }

    setLoadingPrevDate(false);
  };

  return (
    <Container>
      <Date data-testid="selected_date">
        <Month>{format(selectedMonth, "MMMM")}</Month>{" "}
        <Year>{format(selectedMonth, "yyyy")}</Year>
      </Date>
      <CircleButton
        isLoading={loadingPrevDate}
        onClick={handlePrevMonthClick}
        data-testid="prev_month_button"
      >
        <ChevronLeft />
      </CircleButton>
      <CircleButton
        isLoading={loadingNextDate}
        onClick={handleNextMonthClick}
        data-testid="next_month_button"
      >
        <ChevronRight />
      </CircleButton>
    </Container>
  );
};

export default DesktopCalendarControlsLayout;

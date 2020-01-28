import React, {useContext, useState} from "react"
import {styled} from "styletron-react"
import cssToObject from "css-to-object"
import {addMonths, format, subMonths} from "date-fns"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import getErrorMessage from "utils/FetchErrorHandling"
import {ReactComponent as ChevronRight} from "assets/icons/chevron-right.svg"
import {ReactComponent as ChevronLeft} from "assets/icons/chevron-left.svg"
import CircleButton from "core/components/Button/CircleButton"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {fetchBinnacleData} from "core/contexts/BinnacleContext/binnacleService"

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
  const {state, dispatch} = useContext(BinnacleDataContext)
  const addNotification = useContext(NotificationsContext);

  const [loadingPrevDate, setLoadingPrevDate] = useState(false);
  const [loadingNextDate, setLoadingNextDate] = useState(false);

  const handleNextMonthClick = () => {
    const nextMonth = addMonths(state.month, 1);

    fetchBinnacleData(nextMonth, state.isTimeCalculatedByYear, dispatch)
      .catch(error => addNotification(getErrorMessage(error)))
  };

  const handlePrevMonthClick = async () => {
    const prevMonth = subMonths(state.month, 1);

    fetchBinnacleData(prevMonth, state.isTimeCalculatedByYear, dispatch)
      .catch(error => addNotification(getErrorMessage(error)))
  };

  return (
    <Container>
      <Date data-testid="selected_date">
        <Month>{format(state.month, "MMMM")}</Month>{" "}
        <Year>{format(state.month, "yyyy")}</Year>
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

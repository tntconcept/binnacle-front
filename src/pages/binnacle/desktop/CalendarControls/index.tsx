// @ts-ignore
import React, { useContext, useTransition } from "react";
import { ReactComponent as ChevronRight } from "assets/icons/chevron-right.svg";
import { ReactComponent as ChevronLeft } from "assets/icons/chevron-left.svg";
import { BinnacleDataContext } from "core/contexts/BinnacleContext/BinnacleDataProvider";
import styles from "pages/binnacle/desktop/CalendarControls/CalendarControls.module.css";
import Button from "core/components/Button";
import { useTranslation } from "react-i18next";
import DateTime from "services/DateTime";
import { BinnacleActions } from "core/contexts/BinnacleContext/BinnacleActions";
import { mutate } from "swr";
import { formatDateForQuery } from "utils/DateUtils";
import { endOfMonth, startOfMonth } from "date-fns";
import endpoints from "api/endpoints";
import { fetcher } from "core/contexts/UserContext";

function prefetch() {
  mutate(
    [],
    fetch("/api/data").then(res => res.json())
  );
}

const CalendarControls: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(BinnacleDataContext);
  const [startTransition, isPending] = useTransition({ timeoutMs: 4000 });

  const handleNextMonthClick = async () => {
    const nextMonth = DateTime.addMonths(state.month, 1);
    dispatch(BinnacleActions.changeMonth(nextMonth));

    const startDate = formatDateForQuery(startOfMonth(nextMonth));
    const endDate = formatDateForQuery(endOfMonth(nextMonth));
    const endpoint_key =
      endpoints.timeBalance + `?startDate=${startDate}&endDate=${endDate}`;

    await mutate(endpoint_key, await fetcher(endpoint_key));
  };

  const handlePrevMonthClick = async () => {
    const prevMonth = DateTime.subMonths(state.month, 1);
    dispatch(BinnacleActions.changeMonth(prevMonth));
  };

  return (
    <div className={styles.container}>
      <p
        className={styles.date}
        data-testid="selected_date">
        <span className={styles.month}>
          {DateTime.format(state.month, "MMMM")}
        </span>{" "}
        <span className={styles.year}>
          {DateTime.format(state.month, "yyyy")}
        </span>
      </p>
      <Button
        isTransparent
        isCircular
        onClick={handlePrevMonthClick}
        data-testid="prev_month_button"
        aria-label={t("accessibility.prev_month", {
          monthStr: DateTime.format(
            DateTime.subMonths(state.month, 1),
            "LLLL yyyy"
          )
        })}
      >
        <ChevronLeft />
      </Button>
      <Button
        isTransparent
        isCircular
        onClick={() => {
          startTransition(() => handleNextMonthClick());
        }}
        data-testid="next_month_button"
        isLoading={isPending}
        aria-label={t("accessibility.next_month", {
          monthStr: DateTime.format(
            DateTime.addMonths(state.month, 1),
            "LLLL yyyy"
          )
        })}
      >
        <ChevronRight />
        {isPending ? "..." : "#"}
      </Button>
    </div>
  );
};

export default CalendarControls;

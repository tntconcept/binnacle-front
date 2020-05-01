// @ts-ignore
import React, {useTransition} from "react"
import {ReactComponent as ChevronRight} from "assets/icons/chevron-right.svg"
import {ReactComponent as ChevronLeft} from "assets/icons/chevron-left.svg"
import styles from "pages/binnacle/desktop/CalendarControls/CalendarControls.module.css"
import Button from "core/components/Button"
import {useTranslation} from "react-i18next"
import DateTime from "services/DateTime"
import {useCalendarResources} from "pages/binnacle/desktop/CalendarResourcesContext"

const CalendarControls: React.FC = () => {
  const { t } = useTranslation();
  const {changeMonth, selectedMonth} = useCalendarResources()
  const [startTransition, isPending] = useTransition({ timeoutMs: 2000 });

  const handleNextMonthClick = () => {
    startTransition(() => {
      const nextMonth = DateTime.addMonths(selectedMonth, 1);
      changeMonth(nextMonth)
    })
  };

  const handlePrevMonthClick = async () => {
    startTransition(() => {
      const prevMonth = DateTime.subMonths(selectedMonth, 1);
      changeMonth(prevMonth)
    })
  };

  return (
    <div className={styles.container}>
      <p
        className={styles.date}
        data-testid="selected_date">
        <span className={styles.month}>
          {DateTime.format(selectedMonth, "MMMM")}
        </span>{" "}
        <span className={styles.year}>
          {DateTime.format(selectedMonth, "yyyy")}
        </span>
      </p>
      <Button
        isTransparent
        isCircular
        onClick={handlePrevMonthClick}
        data-testid="prev_month_button"
        aria-label={t("accessibility.prev_month", {
          monthStr: DateTime.format(
            DateTime.subMonths(selectedMonth, 1),
            "LLLL yyyy"
          )
        })}
      >
        <ChevronLeft />
      </Button>
      <Button
        isTransparent
        isCircular
        onClick={handleNextMonthClick}
        data-testid="next_month_button"
        isLoading={isPending}
        aria-label={t("accessibility.next_month", {
          monthStr: DateTime.format(
            DateTime.addMonths(selectedMonth, 1),
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

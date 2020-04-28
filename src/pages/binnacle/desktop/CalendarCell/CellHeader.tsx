import React, {forwardRef, useContext, useMemo} from "react"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import styles from "pages/binnacle/desktop/CalendarCell/CalendarCell.module.css"
import {cls} from "utils/helpers"
import {getDate, isSameMonth, isToday} from "date-fns"
import {getDuration} from "utils/TimeUtils"
import DateTime from "services/DateTime"
import {isPrivateHoliday, isPublicHoliday} from "utils/DateUtils"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {useTranslation} from "react-i18next"

interface ICellHeader {
  date: Date;
  time: number;
}

const CellHeader = forwardRef<HTMLButtonElement, ICellHeader>((props, ref) => {
  const { t } = useTranslation();
  const { state } = useContext(BinnacleDataContext);
  const { state: settingsState } = useContext(SettingsContext);
  const today = isToday(props.date);

  const publicHolidayFound = useMemo(
    () => isPublicHoliday(state.holidays.publicHolidays, props.date),
    [props.date, state.holidays.publicHolidays]
  );
  const privateHolidayFound = useMemo(
    () => isPrivateHoliday(state.holidays.privateHolidays, props.date),
    [props.date, state.holidays.privateHolidays]
  );

  const holidayDescription = publicHolidayFound
    ? publicHolidayFound.description
    : privateHolidayFound
      ? t("vacations")
      : undefined;

  const holidayLabel =
    holidayDescription !== undefined ? `, ${holidayDescription}` : "";
  const timeLabel = DateTime.getHumanizedDuration(props.time, false);
  const dayLabel =
    DateTime.format(props.date, "d, EEEE MMMM yyyy") +
    (timeLabel !== "" ? ", " + timeLabel : "") +
    holidayLabel;

  //
  const a11yFocusDay = useMemo(() => {
    if (DateTime.isThisMonth(state.month)) {
      return today ? 0 : -1
    }

    return DateTime.isFirstDayOfMonth(props.date) && isSameMonth(state.month, props.date) ? 0 : -1
  }, [props.date, state.month, today])

  return (
    <React.Fragment>
      {publicHolidayFound || privateHolidayFound ? (
        <div
          className={cls(
            styles.isPublicHoliday,
            privateHolidayFound && styles.isPrivateHoliday
          )}
        />
      ) : null}
      <button
        className={styles.header}
        tabIndex={a11yFocusDay}
        aria-label={dayLabel}
        ref={ref}
      >
        <span
          className={cls(today && styles.today)}
          data-testid={today ? "today" : undefined}
        >
          {getDate(props.date)}
        </span>
        {holidayDescription && (
          <span className={styles.holidayDescription}>
            {holidayDescription}
          </span>
        )}
        {props.time !== 0 && (
          <span className={styles.time}>
            {getDuration(props.time, settingsState.useDecimalTimeFormat)}
          </span>
        )}
      </button>
    </React.Fragment>
  );
});

export default CellHeader;

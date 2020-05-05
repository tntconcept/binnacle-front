import React, {forwardRef, useContext, useMemo} from "react"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import styles from "pages/binnacle/desktop/CalendarCell/CalendarCell.module.css"
import {cls} from "utils/helpers"
import {getDate, isSameMonth, isToday} from "date-fns"
import {getDuration} from "utils/TimeUtils"
import DateTime from "services/DateTime"
import {isPrivateHoliday, isPublicHoliday} from "utils/DateUtils"
import {useTranslation} from "react-i18next"
import {useCalendarResources} from "core/contexts/CalendarResourcesContext"

interface ICellHeader {
  date: Date;
  time: number;
}

const CellHeader = forwardRef<HTMLButtonElement, ICellHeader>((props, ref) => {
  const { t } = useTranslation();
  const {selectedMonth, holidaysResource} = useCalendarResources()
  const holidays = holidaysResource.read()

  const { state: settingsState } = useContext(SettingsContext);
  const today = isToday(props.date);

  const publicHolidayFound = useMemo(
    () => isPublicHoliday(holidays.publicHolidays, props.date),
    [props.date, holidays.publicHolidays]
  );
  const privateHolidayFound = useMemo(
    () => isPrivateHoliday(holidays.privateHolidays, props.date),
    [props.date, holidays.privateHolidays]
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


  const a11yFocusDay = useMemo(() => {
    if (DateTime.isThisMonth(selectedMonth)) {
      return today ? 0 : -1
    }

    return DateTime.isFirstDayOfMonth(props.date) && isSameMonth(selectedMonth, props.date) ? 0 : -1
  }, [props.date, selectedMonth, today])

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

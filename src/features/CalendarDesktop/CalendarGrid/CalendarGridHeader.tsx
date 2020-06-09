import React, {useContext} from "react"
import styles from "features/CalendarDesktop/CalendarGrid/CalendarGrid.module.css"
import {getWeekdaysName} from "utils/DateUtils"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"

const weekDaysName = getWeekdaysName();

interface ICalendarGridHeader {
  hideWeekend: boolean;
}

const CalendarGridHeader: React.FC<ICalendarGridHeader> = ({ hideWeekend }) => {
  const { state } = useContext(SettingsContext);

  return (
    <React.Fragment>
      <span aria-hidden className={styles.weekDay}>{weekDaysName[0]}</span>
      <span aria-hidden className={styles.weekDay}>{weekDaysName[1]}</span>
      <span aria-hidden className={styles.weekDay}>{weekDaysName[2]}</span>
      <span aria-hidden className={styles.weekDay}>{weekDaysName[3]}</span>
      <span aria-hidden className={styles.weekDay}>{weekDaysName[4]}</span>
      {!hideWeekend && (
        <span aria-hidden className={styles.weekDay}>
          {state.hideSaturday
            ? weekDaysName[6]
            : state.hideSunday
              ? weekDaysName[5]
              : `${weekDaysName[5]}/${weekDaysName[6]}`}
        </span>
      )}
    </React.Fragment>
  );
};

export default CalendarGridHeader;

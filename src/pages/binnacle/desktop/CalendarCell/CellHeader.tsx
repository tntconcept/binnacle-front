import React, {useContext} from "react"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import styles from "pages/binnacle/desktop/CalendarCell/CalendarCell.module.css"
import {cls} from "utils/helpers"
import {getDate, isToday} from "date-fns"
import {getDuration} from "utils/TimeUtils"
import DateTime from "services/DateTime"

interface ICellHeader {
  date: Date;
  holidayDescription?: string;
  time: number;
}

const CellHeader: React.FC<ICellHeader> = props => {
  const { state } = useContext(SettingsContext);
  const today = isToday(props.date);

  const dayLabel =
    DateTime.format(props.date, "d, EEEE MMMM yyyy") + props.holidayDescription
      ? `, ${props.holidayDescription}`
      : "";

  return (
    <div className={styles.header}>
      <span
        className={cls(today && styles.today)}
        data-testid={today ? "today" : undefined}
      >
        {getDate(props.date)}
      </span>
      {props.holidayDescription && (
        <span className={styles.holidayDescription}>
          {props.holidayDescription}
        </span>
      )}
      {props.time !== 0 && (
        <span className={styles.time}>
          {getDuration(props.time, state.useDecimalTimeFormat)}
        </span>
      )}
    </div>
  )
}

export default CellHeader;

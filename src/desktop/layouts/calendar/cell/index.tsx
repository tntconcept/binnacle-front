import React from "react"
import styles from "./cell.module.css"
import classNames from "classnames/bind"
import {format, getDate} from "date-fns"
import PlusIcon from "assets/icons/plus.svg"
import {getHumanizedDuration} from "utils/timeUtils"

const cx = classNames.bind(styles);

export const Cell: React.FC = props => {
  return <div className={styles.base}>{props.children}</div>;
};

interface ICellContainer {
  isOtherMonth: boolean;
  isPublicHoliday: boolean;
  isPrivateHoliday: boolean;
  borderBottom?: boolean;
}

export const CellContainer: React.FC<ICellContainer> = props => {
  const className = cx({
    container: true,
    isOtherMonth: props.isOtherMonth,
    isPublicHoliday: props.isPublicHoliday,
    isPrivateHoliday: props.isPrivateHoliday,
    containerDivider: props.borderBottom === true
  });

  return <div className={className}>{props.children}</div>;
};

interface ICellHeader {
  date: Date;
  isOtherMonth: boolean;
  holidayText?: string;
  time: number;
  onAddActivity: () => void
}

export const CellHeader: React.FC<ICellHeader> = props => {
  return (
    <div className={styles.header}>
      <span>
        {getDate(props.date)} {props.isOtherMonth && format(props.date, "MMMM")}
      </span>
      {props.holidayText && (
        <span className={styles.holidayDescription}>{props.holidayText}</span>
      )}
      {props.time !== 0 && (
        <span className={styles.time}>{getHumanizedDuration(props.time)}</span>
      )}
      <button className={styles.button} onClick={props.onAddActivity}>
        <img
          style={{
            height: "10px"
          }}
          src={PlusIcon}
        />
      </button>
    </div>
  );
};

export const CellBody: React.FC = props => {
  return <div className={styles.body}>{props.children}</div>;
};

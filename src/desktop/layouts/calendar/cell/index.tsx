import React from "react";
import styles from "./cell.module.css";
import classNames from "classnames/bind";
import { format, getDate } from "date-fns";
import PlusIcon from "assets/icons/plus.svg";

const cx = classNames.bind(styles);

const Cell: React.FC = props => {
  return <div className={styles.base}>{props.children}</div>;
};

interface ICellContainer {
  isOtherMonth: boolean;
  isPublicHoliday: boolean;
  isPrivateHoliday: boolean;
}

const CellContainer: React.FC<ICellContainer> = props => {
  const className = cx({
    container: true,
    isOtherMonth: props.isOtherMonth,
    isPublicHoliday: props.isPublicHoliday,
    isPrivateHoliday: props.isPrivateHoliday
  });

  return <div className={className}>{props.children}</div>;
};

interface ICellHeader {
  date: Date;
  isOtherMonth: boolean;
  holidayText?: string;
  time: number;
}

const CellHeader: React.FC<ICellHeader> = props => {
  return (
    <div className={styles.header}>
      <span>
        {getDate(props.date)}
        {props.isOtherMonth && format(props.date, "MMMM")}
      </span>
      {props.holidayText && <span>{props.holidayText}</span>}
      <span>{props.time}</span>
      <button className={styles.button}>
        {/* TODO refactor to svg */}
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

const CellBody: React.FC = props => {
  return <div className={styles.body}>{props.children}</div>;
};

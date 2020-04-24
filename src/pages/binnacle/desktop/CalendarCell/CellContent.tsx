import React, {useContext} from "react"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {isSameMonth} from "date-fns"
import {cls} from "utils/helpers"
import styles from "pages/binnacle/desktop/CalendarCell/CalendarCell.module.css"

interface ICellContent {
  dayOfMonth: Date;
  borderBottom?: boolean;
  handleClick: () => void;
}

export const CellContent: React.FC<ICellContent> = props => {
  const { state } = useContext(BinnacleDataContext);
  const isOtherMonth = !isSameMonth(props.dayOfMonth, state.month);

  return (
    <div
      className={cls(
        styles.container,
        isOtherMonth && styles.isOtherMonth,
        props.borderBottom && styles.containerDivider
      )}
      onClick={props.handleClick}
    >
      {props.children}
    </div>
  );
};

import React, {useContext} from "react"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {addDays, isSaturday, isSunday} from "date-fns"
import {Cell, CellContainer,} from "desktop/layouts/calendar/cell"
import {motion} from "framer-motion"
import styles from "./calendar.module.css"

const DesktopCalendarBodyLayout: React.FC = () => {
  const { state } = useContext(BinnacleDataContext);

  const getCells = () => {
    return state.activities.map((activity, index) => {
      if (isSunday(activity.date)) {
        return null;
      }

      return (
        <Cell key={activity.date.getTime()}>
          {isSaturday(activity.date) ? (
            <React.Fragment>
              <CellContainer
                dayOfMonth={activity.date}
                activityDay={activity}
                borderBottom
              />
              <CellContainer
                dayOfMonth={addDays(activity.date, 1)}
                activityDay={state.activities[index + 1]}
              />
            </React.Fragment>
          ) : (
            <CellContainer
              dayOfMonth={activity.date}
              activityDay={activity}
            />
          )}
        </Cell>
      );
    });
  };

  return (
    <motion.div
      className={styles.container}
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.header}>
        <span className={styles.weekDay}>Mon</span>
        <span className={styles.weekDay}>Tue</span>
        <span className={styles.weekDay}>Wed</span>
        <span className={styles.weekDay}>Thu</span>
        <span className={styles.weekDay}>Fri</span>
        <span className={styles.weekDay}>Sat/Sun</span>
      </div>
      <div className={styles.grid}>{getCells()}</div>
    </motion.div>
  );
};

export default DesktopCalendarBodyLayout;

import React, {useContext} from "react"
import styles from "pages/binnacle/desktop/CalendarGrid/CalendarGrid.module.css"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {addDays, isSaturday, isSunday} from "date-fns"
import Cell from "pages/binnacle/desktop/CalendarCell"
import {motion} from "framer-motion"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import {getWeekdaysName} from "utils/DateUtils"
import {CellContainer} from "pages/binnacle/desktop/CalendarCell/CellContainer"

const CalendarGrid: React.FC = () => {
  const { state } = useContext(BinnacleDataContext);
  const { state: settingsState } = useContext(SettingsContext);

  const getCells = () => {
    return state.activities.map((activity, index) => {
      if (isSunday(activity.date)) {
        return null;
      }

      return (
        <Cell key={activity.date.getTime() + index}>
          {isSaturday(activity.date) ? (
            !hideWeekend && (
              <React.Fragment>
                {!settingsState.hideSaturday && (
                  <CellContainer
                    key={index}
                    dayOfMonth={activity.date}
                    activityDay={activity}
                    borderBottom={!settingsState.hideSunday}
                  />
                )}
                {!settingsState.hideSunday && (
                  <CellContainer
                    key={index + 1}
                    dayOfMonth={addDays(activity.date, 1)}
                    activityDay={state.activities[index + 1]}
                  />
                )}
              </React.Fragment>
            )
          ) : (
            <CellContainer
              key={index}
              dayOfMonth={activity.date}
              activityDay={activity}
            />
          )}
        </Cell>
      );
    });
  };

  const weekDaysName = getWeekdaysName();
  const hideWeekend = settingsState.hideSaturday && settingsState.hideSunday;

  return (
    <motion.div
      className={styles.container}
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
    >
      <React.Fragment>
        <span className={styles.weekDay}>{weekDaysName[0]}</span>
        <span className={styles.weekDay}>{weekDaysName[1]}</span>
        <span className={styles.weekDay}>{weekDaysName[2]}</span>
        <span className={styles.weekDay}>{weekDaysName[3]}</span>
        <span className={styles.weekDay}>{weekDaysName[4]}</span>
        {!hideWeekend && (
          <span className={styles.weekDay}>
            {settingsState.hideSaturday
              ? weekDaysName[6]
              : settingsState.hideSunday
                ? weekDaysName[5]
                : `${weekDaysName[5]}/${weekDaysName[6]}`}
          </span>
        )}
      </React.Fragment>
      <React.Fragment>
        {getCells()}
      </React.Fragment>
    </motion.div>
  );
};

export default CalendarGrid;

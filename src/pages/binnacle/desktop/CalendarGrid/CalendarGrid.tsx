import React, {useContext, useEffect, useRef} from "react"
import styles from "pages/binnacle/desktop/CalendarGrid/CalendarGrid.module.css"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {addDays, isSaturday, isSunday} from "date-fns"
import Cell from "pages/binnacle/desktop/CalendarCell"
import {motion} from "framer-motion"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import {CellContainer} from "pages/binnacle/desktop/CalendarCell/CellContainer"
import CalendarGridHeader from "pages/binnacle/desktop/CalendarGrid/CalendarGridHeader"

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

  const hideWeekend = settingsState.hideSaturday && settingsState.hideSunday;

  return (
    <motion.div
      className={styles.container}
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
      tabIndex={0}
    >
      <CalendarGridHeader hideWeekend={hideWeekend} />
      {renderCells()}
    </motion.div>
  );
};

export default CalendarGrid;

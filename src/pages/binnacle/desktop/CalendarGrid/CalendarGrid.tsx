import React, { useContext, useState } from "react";
import styles from "pages/binnacle/desktop/CalendarGrid/CalendarGrid.module.css";
import { BinnacleDataContext } from "core/contexts/BinnacleContext/BinnacleDataProvider";
import { isSaturday, isSunday } from "date-fns";
import Cell from "pages/binnacle/desktop/CalendarCell";
import { SettingsContext } from "core/contexts/SettingsContext/SettingsContext";
import { CellContent } from "pages/binnacle/desktop/CalendarCell/CellContent";
import CalendarGridHeader from "pages/binnacle/desktop/CalendarGrid/CalendarGridHeader";
import useCalendarKeysNavigation from "pages/binnacle/desktop/CalendarGrid/useCalendarKeyboardNavigation";
import { useCalendarResources } from "services/BinnacleService";

const CalendarGrid: React.FC = () => {
  const {
    state: { month }
  } = useContext(BinnacleDataContext);
  const { activities, holidays, recentRoles } = useCalendarResources(month);

  const { state: settingsState } = useContext(SettingsContext);

  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const { calendarRef, cellsRef } = useCalendarKeysNavigation(
    month,
    setSelectedCell
  );

  const hideWeekend = settingsState.hideSaturday && settingsState.hideSunday;

  const renderCells = () => {
    return activities.map((activity, index) => {
      if (isSunday(activity.date)) {
        return null;
      }

      return (
        <Cell key={activity.date.getTime() + index}>
          {isSaturday(activity.date) ? (
            !hideWeekend && (
              <React.Fragment>
                {!settingsState.hideSaturday && (
                  <CellContent
                    key={index}
                    borderBottom={!settingsState.hideSunday}
                    activityDay={activity}
                    isSelected={selectedCell === index}
                    setSelectedCell={setSelectedCell}
                    registerRef={(ref: any) => {
                      // @ts-ignore
                      cellsRef.current[index] = ref;
                    }}
                  />
                )}
                {!settingsState.hideSunday && (
                  <CellContent
                    key={index + 1}
                    activityDay={activities[index + 1]}
                    isSelected={selectedCell === index + 1}
                    setSelectedCell={setSelectedCell}
                    registerRef={(ref: any) => {
                      // @ts-ignore
                      cellsRef.current[index + 1] = ref;
                    }}
                  />
                )}
              </React.Fragment>
            )
          ) : (
            <CellContent
              key={index}
              activityDay={activity}
              isSelected={selectedCell === index}
              setSelectedCell={setSelectedCell}
              registerRef={(ref: any) => {
                // @ts-ignore
                cellsRef.current[index] = ref;
              }}
            />
          )}
        </Cell>
      );
    });
  };

  return (
    <div
      className={styles.container}
      ref={calendarRef}>
      <CalendarGridHeader hideWeekend={hideWeekend} />
      {renderCells()}
    </div>
  );
};

export default CalendarGrid;

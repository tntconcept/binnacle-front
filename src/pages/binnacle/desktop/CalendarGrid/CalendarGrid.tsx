import React, {useContext, useEffect, useRef, useState} from "react"
import styles from "pages/binnacle/desktop/CalendarGrid/CalendarGrid.module.css"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {addDays, getDate, isSaturday, isSunday} from "date-fns"
import Cell from "pages/binnacle/desktop/CalendarCell"
import {motion} from "framer-motion"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import {CellContent} from "pages/binnacle/desktop/CalendarCell/CellContent"
import CalendarGridHeader from "pages/binnacle/desktop/CalendarGrid/CalendarGridHeader"
import Modal from "core/components/Modal"
import DateTime from "services/DateTime"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import useModal from "core/hooks/useModal"
import {IActivity} from "api/interfaces/IActivity"
import ActivityButton from "pages/binnacle/desktop/ActivityButton"
import CellHeader from "pages/binnacle/desktop/CalendarCell/CellHeader"

export interface ActivityData {
  date: Date
  lastEndTime: Date | undefined
  activity: IActivity | undefined
}

const CalendarGrid: React.FC = () => {
  const { state } = useContext(BinnacleDataContext);
  const { state: settingsState } = useContext(SettingsContext);

  const { modalIsOpen, toggleModal } = useModal(false);
  const [activityData, setActivityData] = useState<ActivityData>({
    date: state.month,
    lastEndTime: undefined,
    activity: undefined
  });

  const handleCellClick = () => {
    setActivityData({
      date: state.month,
      lastEndTime: undefined,
      activity: undefined
    });
    toggleModal();
  };

  const handleActivitySelect = (activityData: ActivityData) => {
    setActivityData(activityData);
    toggleModal();
  };

  // const lastEndTime = useMemo(() => {
  //   if (props.activityDay.activities.length > 0) {
  //     const lastImputedActivity =
  //       props.activityDay.activities[props.activityDay.activities.length - 1]
  //     return addMinutes(
  //       lastImputedActivity.startDate,
  //       lastImputedActivity.duration
  //     )
  //   }
  //
  //   return undefined
  // }, [props.activityDay.activities])

  const calendarRef = useRef<HTMLDivElement>(null)
  const refsArray = useRef<HTMLDivElement[] | null>([]);
  const activeRef = useRef<number>(state.month.getDate() + 1)

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight': {
        const nextRef = activeRef.current + 1

        if (nextRef <= refsArray.current!.length - 1) {
          refsArray.current && refsArray.current[nextRef].focus()
          activeRef.current = nextRef
        }

        break
      }
      case 'ArrowLeft': {
        const prevRef = activeRef.current - 1

        if (prevRef >= 0) {
          refsArray.current && refsArray.current[prevRef].focus()
          activeRef.current = prevRef
        }

        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const currentRow = Math.trunc(activeRef.current / 7)
        const prevRow = currentRow - 1
        if (prevRow >= 0) {
          activeRef.current -= 7
          refsArray.current && refsArray.current[activeRef.current].focus()
        }
        break
      }
      case 'ArrowDown': {
        event.preventDefault()
        const currentRow = Math.trunc(activeRef.current / 7)
        const nextRow = currentRow + 1
        if (nextRow < Math.trunc(refsArray.current!.length / 7)) {
          activeRef.current += 7
          refsArray.current && refsArray.current[activeRef.current].focus()
        }
        break
      }
    }

    console.log("refsArray", refsArray, refsArray.current!.length)
  }

  useEffect(() => {
    const node = calendarRef.current
    node && node.addEventListener('keydown', handleKeyDown)

    return () => {
      node && node.removeEventListener('keydown', handleKeyDown)
    }
  }, [calendarRef])

  const hideWeekend = settingsState.hideSaturday && settingsState.hideSunday;

  const renderCells = () => {
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
                  <CellContent
                    key={index}
                    dayOfMonth={activity.date}
                    borderBottom={!settingsState.hideSunday}
                    handleClick={handleCellClick}
                  >
                    <CellHeader
                      date={activity.date}
                      time={activity.workedMinutes}
                      ref={ref => {
                        // @ts-ignore
                        refsArray.current[index] = ref;
                      }}
                    />
                    <div className={styles.cellBody}>
                      {activity.activities.map(activity => (
                        <ActivityButton
                          key={activity.id}
                          activity={activity}
                          onActivitySelect={handleActivitySelect}
                        />
                      ))}
                    </div>
                  </CellContent>
                )}
                {!settingsState.hideSunday && (
                  <CellContent
                    key={index + 1}
                    dayOfMonth={addDays(activity.date, 1)}
                    handleClick={handleCellClick}
                  >
                    <CellHeader
                      date={addDays(activity.date, 1)}
                      time={activity.workedMinutes}
                      ref={ref => {
                        // @ts-ignore
                        refsArray.current[index+1] = ref;
                      }}
                    />
                    <div className={styles.cellBody}>
                      {state.activities[index + 1].activities.map(activity => (
                        <ActivityButton
                          key={activity.id}
                          activity={activity}
                          onActivitySelect={handleActivitySelect}
                        />
                      ))}
                    </div>
                  </CellContent>
                )}
              </React.Fragment>
            )
          ) : (
            <CellContent
              key={index}
              dayOfMonth={activity.date}
              handleClick={handleCellClick}
            >
              <CellHeader
                date={activity.date}
                time={activity.workedMinutes}
                ref={ref => {
                  // @ts-ignore
                  refsArray.current[index] = ref;
                }}
              />
              <div className={styles.cellBody}>
                {activity.activities.map(activity => (
                  <ActivityButton
                    key={activity.id}
                    activity={activity}
                    onActivitySelect={handleActivitySelect}
                  />
                ))}
              </div>
            </CellContent>
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
      tabIndex={0}
      ref={calendarRef}
    >
      <CalendarGridHeader hideWeekend={hideWeekend} />
      {renderCells()}
      {modalIsOpen && (
        <Modal
          onClose={toggleModal}
          ariaLabel="Idk"
          header={
            <div>
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                {getDate(activityData.date)}
              </span>{" "}
              {DateTime.format(activityData.date, 'MMMM')}
            </div>
          }
        >
          <ActivityForm
            date={activityData.date}
            activity={activityData.activity}
            lastEndTime={undefined}
            onAfterSubmit={toggleModal}
          />
        </Modal>
      )}
    </motion.div>
  );
};

export default CalendarGrid;

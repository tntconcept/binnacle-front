import React, {useContext, useEffect, useMemo, useRef, useState} from "react"
import styles from "pages/binnacle/desktop/CalendarGrid/CalendarGrid.module.css"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {addDays, addMinutes, differenceInDays, getDate, isSameDay, isSaturday, isSunday} from "date-fns"
import Cell from "pages/binnacle/desktop/CalendarCell"
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
import CellBody from "pages/binnacle/desktop/CalendarCell/CellBody"
import VisuallyHidden from "core/components/VisuallyHidden"
import {firstDayOfFirstWeekOfMonth} from "utils/DateUtils"

export interface ActivityData {
  date: Date
  lastEndTime: Date | undefined
  activity: IActivity | undefined
}

interface IActivitiesList {
  activities: IActivity[]
  onActivitySelect: (data: ActivityData) => void
  canFocus: boolean
}

const ActivitiesList: React.FC<IActivitiesList> = ({activities, onActivitySelect, canFocus}) => {
  return (
    <React.Fragment>
      {
        activities.map(activity => (
          <ActivityButton
            key={activity.id}
            activity={activity}
            onActivitySelect={onActivitySelect}
            canFocus={canFocus}
          />
        ))
      }
    </React.Fragment>
  )
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


  const lastEndTime = useMemo(() => {
    const activityDay = state.activities.find(day => isSameDay(day.date, activityData.date))

    if (activityDay) {
      if (activityDay.activities.length > 0) {
        const lastImputedActivity =
          activityDay.activities[activityDay.activities.length - 1]
        return addMinutes(
          lastImputedActivity.startDate,
          lastImputedActivity.duration
        )
      }
    } else {
      return undefined
    }

  }, [activityData.date, state.activities])

  const handleCellClick = () => {
    setActivityData({
      date: state.activities[activeRef.current].date,
      lastEndTime: lastEndTime,
      activity: undefined
    });
    toggleModal();
  };

  const handleActivitySelect = (activityData: ActivityData) => {
    setActivityData(activityData);
    activeRef.current = state.activities.findIndex(day =>  isSameDay(day.date, activityData.date)) + 1
    toggleModal();
  };

  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<HTMLDivElement[] | null>([]);
  const activeRef = useRef<number>(differenceInDays(state.month, firstDayOfFirstWeekOfMonth(state.month)))

  useEffect(() => {
    // Cells ref contains all the cells that are rendered on the calendar, we need to focus today or the first day of month.
    // Because we don't know which index has the date that we want to focus,
    // A workaround is to use the difference between the first day rendered and the date that we want to select.
    if (DateTime.isThisMonth(state.month)) {
      activeRef.current = differenceInDays(state.month, firstDayOfFirstWeekOfMonth(state.month))
    } else {
      activeRef.current =  differenceInDays(DateTime.startOfMonth(state.month), firstDayOfFirstWeekOfMonth(state.month))
    }
  }, [state.month])

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight': {
        const nextRef = activeRef.current + 1
        if (nextRef < cellsRef.current!.length - 1) {
          cellsRef.current && cellsRef.current[nextRef].focus()
          activeRef.current = nextRef
        }

        break
      }
      case 'ArrowLeft': {
        const prevRef = activeRef.current - 1

        if (prevRef >= 0) {
          cellsRef.current && cellsRef.current[prevRef].focus()
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
          cellsRef.current && cellsRef.current[activeRef.current].focus()
        }
        break
      }
      case 'ArrowDown': {
        event.preventDefault()
        const currentRow = Math.trunc(activeRef.current / 7)
        const cells = cellsRef.current!.filter(cell => cell !== null)
        const nextRow = currentRow + 1
        if (nextRow < Math.trunc(cells.length / 7)) {
          activeRef.current += 7
          cellsRef.current && cellsRef.current[activeRef.current].focus()
        }
        break
      }
      case 'Enter': {
        event.preventDefault()
        setSelectedCell(activeRef.current)
        break
      }
    }
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
                        cellsRef.current[index] = ref;
                      }}
                    />
                    <CellBody
                      isSelected={selectedCell === index}
                      onEscKey={() => setSelectedCell(null)}
                    >
                      <ActivitiesList
                        activities={activity.activities}
                        onActivitySelect={handleActivitySelect}
                        canFocus={selectedCell === index}
                      />
                    </CellBody>
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
                        cellsRef.current[index+1] = ref;
                      }}
                    />
                    <CellBody
                      isSelected={selectedCell === index}
                      onEscKey={() => setSelectedCell(null)}
                    >
                      <ActivitiesList
                        activities={state.activities[index + 1].activities}
                        onActivitySelect={handleActivitySelect}
                        canFocus={selectedCell === index}
                      />
                    </CellBody>
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
                  cellsRef.current[index] = ref;
                }}
              />
              <CellBody
                isSelected={selectedCell === index}
                onEscKey={() => setSelectedCell(null)}
              >
                <ActivitiesList
                  activities={activity.activities}
                  onActivitySelect={handleActivitySelect}
                  canFocus={selectedCell === index}
                />
              </CellBody>
            </CellContent>
          )}
        </Cell>
      );
    });
  };

  return (
    <div
      className={styles.container}
      ref={calendarRef}
    >
      <CalendarGridHeader hideWeekend={hideWeekend} />
      {renderCells()}
      {modalIsOpen && (
        <Modal
          onClose={toggleModal}
          header={
            <div id='modal-title'>
              <VisuallyHidden id='modal-title'>
                {activityData.activity ? 'Edit activity:' : "Create activity:"}
                {DateTime.format(activityData.date, 'dd MMMM')}
              </VisuallyHidden>
              <b style={{fontSize: 18}}>
                {getDate(activityData.date)}
              </b>
              {DateTime.format(activityData.date, ' MMMM')}
            </div>
          }
        >
          <ActivityForm
            date={activityData.date}
            activity={activityData.activity}
            lastEndTime={lastEndTime}
            onAfterSubmit={toggleModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default CalendarGrid;

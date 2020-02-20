import React, {useContext, useMemo, useState} from "react"
import styles from "./cell.module.css"
import {addMinutes, format, getDate, isSameMonth} from "date-fns"
import {getDuration} from "utils/TimeUtils"
import {cls} from "utils/helpers"
import {IActivity, IActivityDay} from "interfaces/IActivity"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {isPrivateHoliday, isPublicHoliday} from "desktop/layouts/calendar/utils"
import ActivityButton from "desktop/layouts/calendar/activity"
import useModal from "core/hooks/useModal"
import Modal from "core/components/Modal"
import {es} from "date-fns/locale"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"

export const Cell: React.FC = props => {
  return <div className={styles.base}>{props.children}</div>;
};

interface ICellHeader {
  date: Date;
  holidayDescription?: string;
  time: number;
}

const CellHeader: React.FC<ICellHeader> = props => {
  const {state} = useContext(SettingsContext)
  return (
    <div className={styles.header}>
      <span>{getDate(props.date)}</span>
      {props.holidayDescription && (
        <span className={styles.holidayDescription}>
          {props.holidayDescription}
        </span>
      )}
      {props.time !== 0 && (
        <span className={styles.time}>{getDuration(props.time, state.useDecimalTimeFormat)}</span>
      )}
    </div>
  );
};

interface ICellContainer {
  dayOfMonth: Date;
  activityDay: IActivityDay;
  borderBottom?: boolean;
}

export const CellContainer: React.FC<ICellContainer> = props => {
  const { state } = useContext(BinnacleDataContext);
  const { modalIsOpen, toggleModal: toggleModal } = useModal(false);
  const [selectedActivity, setSelectedActivity] = useState<
    IActivity | undefined
  >(undefined);

  const handleCellClick = () => {
    setSelectedActivity(undefined);
    toggleModal();
    console.log('handleCellClick')
  };

  const handleActivitySelect = (activity: IActivity) => {
    setSelectedActivity(activity);
    toggleModal();
    console.log("handleActivitySelect")
  };

  const publicHolidayFound = useMemo(
    () => isPublicHoliday(state.holidays.publicHolidays, props.dayOfMonth),
    [props.dayOfMonth, state.holidays.publicHolidays]
  );
  const privateHolidayFound = useMemo(
    () => isPrivateHoliday(state.holidays.privateHolidays, props.dayOfMonth),
    [props.dayOfMonth, state.holidays.privateHolidays]
  );

  const holidayDescription = publicHolidayFound
    ? publicHolidayFound.description
    : privateHolidayFound
      ? "Vacaciones"
      : undefined;

  const isOtherMonth = !isSameMonth(props.dayOfMonth, state.month);

  const lastEndTime = useMemo(() => {
    if (props.activityDay.activities.length > 0) {
      const lastImputedActivity = props.activityDay.activities[props.activityDay.activities.length - 1]
      return addMinutes(lastImputedActivity.startDate, lastImputedActivity.duration)
    }

    return undefined
  }, [props.activityDay.activities])

  return (
    <React.Fragment>
      {publicHolidayFound || privateHolidayFound ? (
        <div
          className={cls(
            styles.isPublicHoliday,
            privateHolidayFound && styles.isPrivateHoliday
          )}
        />
      ) : null}
      <div
        className={cls(
          styles.container,
          isOtherMonth && styles.isOtherMonth,
          props.borderBottom && styles.containerDivider
        )}
        onClick={handleCellClick}
        tabIndex={-1}
      >
        <CellHeader
          date={props.dayOfMonth}
          holidayDescription={holidayDescription}
          time={props.activityDay.workedMinutes}
        />
        <div className={styles.body}>
          {props.activityDay.activities.map(activity => (
            <ActivityButton
              key={activity.id}
              activity={activity}
              onActivitySelect={handleActivitySelect}
            />
          ))}
        </div>
      </div>
      {modalIsOpen && (
        <Modal
          onClose={toggleModal}
          ariaLabel="Idk"
          header={
            <div>
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                {getDate(props.dayOfMonth)}
              </span>{" "}
              {format(props.dayOfMonth, "MMMM", { locale: es })}
            </div>
          }
        >
          <ActivityForm
            date={props.dayOfMonth}
            activity={selectedActivity}
            lastActivityRole={selectedActivity?.projectRole}
            lastEndTime={lastEndTime}
            onAfterSubmit={toggleModal}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

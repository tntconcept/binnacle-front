import React, {useContext, useMemo, useState} from "react"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import useModal from "core/hooks/useModal"
import {IActivity, IActivityDay} from "api/interfaces/IActivity"
import {addMinutes, format, getDate, isSameMonth} from "date-fns"
import {cls} from "utils/helpers"
import styles from "pages/binnacle/desktop/CalendarCell/styles.module.css"
import ActivityButton from "pages/binnacle/desktop/ActivityButton"
import Modal from "core/components/Modal"
import {es} from "date-fns/locale"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import CellHeader from "pages/binnacle/desktop/CalendarCell/CellHeader"
import {isPrivateHoliday, isPublicHoliday} from "utils/DateUtils"

interface ICellContainer {
  dayOfMonth: Date;
  activityDay: IActivityDay;
  borderBottom?: boolean;
}

export const CellContainer: React.FC<ICellContainer> = props => {
  const { state } = useContext(BinnacleDataContext);
  const { modalIsOpen, toggleModal } = useModal(false);
  const [selectedActivity, setSelectedActivity] = useState<
    IActivity | undefined
  >(undefined);

  const handleCellClick = () => {
    setSelectedActivity(undefined);
    toggleModal();
  };

  const handleActivitySelect = (activity: IActivity) => {
    setSelectedActivity(activity);
    toggleModal();
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
      const lastImputedActivity =
        props.activityDay.activities[props.activityDay.activities.length - 1];
      return addMinutes(
        lastImputedActivity.startDate,
        lastImputedActivity.duration
      );
    }

    return undefined;
  }, [props.activityDay.activities]);

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
            lastEndTime={lastEndTime}
            onAfterSubmit={toggleModal}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

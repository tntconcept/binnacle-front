import React, {useContext} from "react"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {addDays, isSameDay, isSameMonth, isSaturday, isSunday} from "date-fns"
import {Cell, CellBody, CellContainer, CellHeader} from "desktop/layouts/calendar/cell"
import Activity from "./activity"
import {motion} from "framer-motion"
import {IHolidaysResponse} from "interfaces/IHolidays"
import styles from "./calendar.module.css"
import useModal from "core/hooks/useModal"
import Modal from "core/components/Modal"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"

const isPublicHoliday = (
  holidays: IHolidaysResponse["publicHolidays"],
  date: Date
) => holidays.some(holiday => isSameDay(holiday.date, date));

const DesktopCalendarBodyLayout: React.FC = () => {
  const { state, dispatch } = useContext(BinnacleDataContext);
  const {modalIsOpen, toggleIsOpen} = useModal(false);

  const getCells3 = () => {
    return state.activities.map((activity, index) => {
      const isOtherMonth = !isSameMonth(activity.date, state.month);

      if (isSunday(activity.date)) {
        return null;
      }

      return (
        <Cell key={activity.date.getTime()}>
          {isSaturday(activity.date) ? (
            <React.Fragment>
              <CellContainer
                isOtherMonth={isOtherMonth}
                isPublicHoliday={isPublicHoliday(
                  state.holidays.publicHolidays,
                  activity.date
                )}
                isPrivateHoliday={false}
                borderBottom={true}
              >
                <CellHeader
                  date={activity.date}
                  isOtherMonth={isOtherMonth}
                  holidayText="Día de la almudena-Día de la almudena"
                  time={620}
                  onAddActivity={toggleIsOpen}
                />
                <CellBody>
                  {activity.activities.map(activity => (
                    <Activity activity={activity} key={activity.id} />
                  ))}
                </CellBody>
              </CellContainer>
              <CellContainer
                isOtherMonth={
                  !isSameMonth(addDays(activity.date, 1), state.month)
                }
                isPublicHoliday={isPublicHoliday(
                  state.holidays.publicHolidays,
                  addDays(activity.date, 1)
                )}
                isPrivateHoliday={false}
              >
                <CellHeader
                  isOtherMonth={
                    !isSameMonth(addDays(activity.date, 1), state.month)
                  }
                  date={addDays(activity.date, 1)}
                  time={activity.workedMinutes}
                  onAddActivity={toggleIsOpen}
                />
                <CellBody>
                  {state.activities[index + 1].activities.map(activity => (
                    <Activity activity={activity} key={activity.id} />
                  ))}
                </CellBody>
              </CellContainer>
            </React.Fragment>
          ) : (
            <CellContainer
              isOtherMonth={isOtherMonth}
              isPublicHoliday={isPublicHoliday(
                state.holidays.publicHolidays,
                activity.date
              )}
              isPrivateHoliday={false}
            >
              <CellHeader
                date={activity.date}
                isOtherMonth={isOtherMonth}
                time={activity.workedMinutes}
                onAddActivity={toggleIsOpen}
              />
              <CellBody>
                {state.activities[index + 1].activities.map(activity => (
                  <Activity activity={activity} key={activity.id} />
                ))}
              </CellBody>
            </CellContainer>
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
      <div className={styles.grid}>{getCells3()}</div>
      {modalIsOpen && <Modal onClose={toggleIsOpen} ariaLabel="Idk" >
        <ActivityForm onAfterSubmit={toggleIsOpen} />
      </Modal>}
    </motion.div>
  );
};

export default DesktopCalendarBodyLayout;

import React, {useContext} from "react"
import styles from "./calendar.module.css"
import PlusIcon from "assets/icons/plus.svg"
import {addDays, format, getDate, isSameMonth, isSaturday, isSunday, isToday} from "date-fns"
import {motion} from "framer-motion"
import Activity from "desktop/layouts/calendar/activity"
import {Cell, CellBody, CellContainer, CellHeader} from "desktop/layouts/calendar/cell"
import {BinnacleDataContext} from "core/controllers/BinnacleDataProvider"

const isPublicHoliday = (holiday: Record<string, string[]>, date: Date) => false

const DesktopCalendarBodyLayout: React.FC = () => {

  const {state, dispatch} = useContext(BinnacleDataContext)

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
                />
                <CellBody>
                  {activity.activities.map(activity => (
                    <Activity
                      activity={activity}
                      key={activity.id} />
                  ))}
                </CellBody>
              </CellContainer>
              <CellContainer
                isOtherMonth={
                  !isSameMonth(addDays(activity.date, 1), state.month)
                }
                isPublicHoliday={isPublicHoliday(state.holidays.publicHolidays, addDays(activity.date, 1))}
                isPrivateHoliday={false}
              >
                <CellHeader
                  isOtherMonth={
                    !isSameMonth(addDays(activity.date, 1), selectedMonth)
                  }
                  date={addDays(activity.date, 1)}
                  time={activity.workedMinutes}
                />
                <CellBody>
                  {calendarData.activities[index + 1].activities.map(
                    activity => (
                      <Activity
                        activity={activity}
                        key={activity.id} />
                    )
                  )}
                </CellBody>
              </CellContainer>
            </React.Fragment>
          ) : (
            <CellContainer
              isOtherMonth={isOtherMonth}
              isPublicHoliday={isPublicHoliday(calendarData.holidays.publicHolidays, activity.date)}
              isPrivateHoliday={false}
            >
              <CellHeader
                date={activity.date}
                isOtherMonth={isOtherMonth}
                time={activity.workedMinutes}
              />
              <CellBody>
                {calendarData.activities[index + 1].activities.map(activity => (
                  <Activity
                    activity={activity}
                    key={activity.id} />
                ))}
              </CellBody>
            </CellContainer>
          )}
        </Cell>
      );
    });
  };

  const getCells2 = () => {
    return calendarData.activities.map((activity, index) => {
      const isNotThisMonth = !isSameMonth(activity.date, selectedMonth);

      if (isSunday(activity.date)) {
        return null;
      }

      return (
        <div
          key={activity.date.getTime()}
          className={`
            ${isNotThisMonth ? styles.cellOtherMonth : ""}
            ${isPublicHoliday(
          calendarData.holidays.publicHolidays,
          activity.date
        )
          ? styles.cellHoliday
          : ""
        }
          `}
        >
          {isSaturday(activity.date) ? (
            <React.Fragment>
              <div>
                <div
                  style={{
                    height: "24px"
                  }}
                >
                  <span className={styles.dayNumber}>
                    <span>
                      {getDate(activity.date)}{" "}
                      {isNotThisMonth && format(activity.date, "MMMM")}
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    maxHeight: "30px",
                    overflowY: "scroll"
                  }}
                >
                  {activity.activities.map(activity => (
                    <Activity activity={activity} />
                  ))}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: !isSameMonth(
                    addDays(activity.date, 1),
                    selectedMonth
                  )
                    ? "silver"
                    : "inherit"
                }}
              >
                <span className={styles.day}>
                  <span>
                    {getDate(addDays(activity.date, 1))}{" "}
                    {!isSameMonth(addDays(activity.date, 1), selectedMonth) &&
                      format(addDays(activity.date, 1), "MMMM")}
                  </span>
                </span>
                <div
                  style={{
                    maxHeight: "30px",
                    overflowY: "scroll"
                  }}
                >
                  {calendarData.activities[index + 1].activities.map(
                    activity => (
                      <Activity
                        activity={activity}
                        key={activity.id} />
                    )
                  )}
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className={styles.cellHeader}>
                {isToday(activity.date) ? (
                  <motion.div
                    className={styles.animatedDay}
                    initial={{
                      scale: 0.3
                    }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>{getDate(activity.date)}</span>
                  </motion.div>
                ) : (
                  <span
                    className={`${isToday(activity.date) ? styles.today : ""}`}
                  >
                    <span>
                      {getDate(activity.date)}{" "}
                      {isNotThisMonth && format(activity.date, "MMMM")}
                    </span>
                  </span>
                )}

                <button className={styles.addButton}>
                  <img
                    style={{
                      height: "10px"
                    }}
                    src={PlusIcon}
                  />
                </button>
              </div>
              <div className={styles.cellBody}>
                {calendarData.activities.length !== 0 &&
                  calendarData.activities[index].activities.map(activity => (
                    <Activity
                      activity={activity}
                      key={activity.id} />
                  ))}
              </div>
            </React.Fragment>
          )}
        </div>
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
    </motion.div>
  );
};

export default DesktopCalendarBodyLayout;

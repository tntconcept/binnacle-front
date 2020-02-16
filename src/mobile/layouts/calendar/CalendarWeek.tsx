import React, {useCallback, useContext, useRef, useState} from "react"
import {motion, PanInfo, useMotionValue, useSpring} from "framer-motion"
import {endOfWeek, getDay, isAfter, isBefore, isSameDay, isThisWeek, isToday, startOfWeek} from "date-fns"
import {
  firstDayOfFirstWeekOfMonth,
  getDaysOfWeek,
  getNextWeek,
  getPreviousWeek,
  lastDayOfLastWeekOfMonth
} from "utils/DateUtils"
import styles from "./CalendarWeek.module.css"
import {cls} from "utils/helpers"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {fetchBinnacleData} from "core/contexts/BinnacleContext/binnacleService"

interface ICalendarWeek {
  initialDate: Date;
  onDateSelect: (date: Date) => void;
}

type WeekToUpdate = "left_week" | "center_week" | "right_week";

const initialValues = {
  leftWeek: "-100%",
  centerWeek: "-0%",
  rightWeek: "100%",
  xAxis: 0,
  lastXAxis: 0,
  nextWeekToMoveOnSwipeRight: "right_week",
  nextWeekToMoveOnSwipeLeft: "left_week"
};

const CalendarWeek: React.FC<ICalendarWeek> = props => {
  const deviceWidth = window.innerWidth;
  const leftWeekPosition = useMotionValue(initialValues.leftWeek);
  const centerWeekPosition = useMotionValue(initialValues.centerWeek);
  const rightWeekPosition = useMotionValue(initialValues.rightWeek);
  const { state, dispatch } = useContext(BinnacleDataContext);

  const xAxis = useSpring(initialValues.xAxis, { mass: 0.3 });

  const [selectedDate, setSelectedDate] = useState(props.initialDate);

  const [leftWeekDays, setLeftWeekDays] = useState(
    getDaysOfWeek(getPreviousWeek(selectedDate))
  );
  const [centerWeekDays, setCenterWeekDays] = useState(
    getDaysOfWeek(selectedDate)
  );
  const [rightWeekDays, setRightWeekDays] = useState(
    getDaysOfWeek(getNextWeek(selectedDate))
  );

  const lastXAxis = useRef(initialValues.lastXAxis);
  const nextWeekToMoveOnSwipeRight = useRef<WeekToUpdate>(
    // @ts-ignore
    initialValues.nextWeekToMoveOnSwipeRight
  );
  // @ts-ignore
  const nextWeekToMoveOnSwipeLeft = useRef<WeekToUpdate>(
    // @ts-ignore
    initialValues.nextWeekToMoveOnSwipeLeft
  );

  const handleReset = () => {
    setSelectedDate(props.initialDate);
    setLeftWeekDays(getDaysOfWeek(getPreviousWeek(props.initialDate)));
    setCenterWeekDays(getDaysOfWeek(props.initialDate));
    setRightWeekDays(getDaysOfWeek(getNextWeek(props.initialDate)));
    leftWeekPosition.set(initialValues.leftWeek);
    centerWeekPosition.set(initialValues.centerWeek);
    rightWeekPosition.set(initialValues.rightWeek);
    xAxis.set(initialValues.xAxis);
    lastXAxis.current = initialValues.lastXAxis;
    nextWeekToMoveOnSwipeRight.current =
      initialValues.nextWeekToMoveOnSwipeRight;
    nextWeekToMoveOnSwipeLeft.current = initialValues.nextWeekToMoveOnSwipeLeft;
  };

  const handleSelectDate = useCallback(
    (newDate: Date) => {
      setSelectedDate(newDate);
      props.onDateSelect(newDate);
    },
    [props]
  );

  const handlePan = (event: Event, info: PanInfo) => {
    const maxSwipeLeft = info.offset.x > deviceWidth;
    const maxSwipeRight = info.offset.x < -Math.abs(deviceWidth);

    if (!maxSwipeLeft && !maxSwipeRight) {
      xAxis.set(info.offset.x + lastXAxis.current);
    }
  };

  const setWeeksPosition = (swipeDirection: "left" | "right") => {
    const leftWeekAux = parseFloat(leftWeekPosition.get());
    const centerWeekAux = parseFloat(centerWeekPosition.get());
    const rightWeekAux = parseFloat(rightWeekPosition.get());

    if (swipeDirection === "left") {
      leftWeekPosition.set(`${centerWeekAux - 100}%`);
      centerWeekPosition.set(`${rightWeekAux - 100}%`);
      rightWeekPosition.set(`${leftWeekAux - 100}%`);
    } else {
      leftWeekPosition.set(`${rightWeekAux + 100}%`);
      centerWeekPosition.set(`${leftWeekAux + 100}%`);
      rightWeekPosition.set(`${centerWeekAux + 100}%`);
    }
  };

  const handlePanEnd = (event: Event, info: PanInfo) => {
    // swipe left to see previous weeks
    if (info.offset.x > deviceWidth / 2) {
      xAxis.set(deviceWidth + lastXAxis.current);
      lastXAxis.current += deviceWidth;

      // get previous week
      const previousWeek = getPreviousWeek(selectedDate);
      // get week days of 2 weeks ago
      const weekdays = getDaysOfWeek(getPreviousWeek(previousWeek));

      // get the previous week monday
      const prevMonday = startOfWeek(previousWeek, { weekStartsOn: 1 });
      if (isBefore(prevMonday, firstDayOfFirstWeekOfMonth(state.month))) {
        console.log("SHOULD FETCH PREVIOUS MONTH");
        fetchBinnacleData(
          prevMonday,
          state.isTimeCalculatedByYear,
          dispatch
        ).catch(error => console.log("nextMonth"));
      }

      switch (nextWeekToMoveOnSwipeRight.current) {
        case "right_week": {
          setRightWeekDays(weekdays);
          setWeeksPosition("left");

          nextWeekToMoveOnSwipeRight.current = "center_week";
          nextWeekToMoveOnSwipeLeft.current = "right_week";
          break;
        }
        case "center_week": {
          setCenterWeekDays(weekdays);
          setWeeksPosition("left");

          nextWeekToMoveOnSwipeRight.current = "left_week";
          nextWeekToMoveOnSwipeLeft.current = "center_week";
          break;
        }
        case "left_week": {
          setLeftWeekDays(weekdays);
          setWeeksPosition("left");

          nextWeekToMoveOnSwipeRight.current = "right_week";
          nextWeekToMoveOnSwipeLeft.current = "left_week";
          break;
        }
      }

      handleSelectDate(isThisWeek(previousWeek) ? new Date() : prevMonday);

      // swipe right to see next weeks
    } else if (info.offset.x < -Math.abs(deviceWidth / 2)) {
      xAxis.set(lastXAxis.current - deviceWidth);
      lastXAxis.current -= deviceWidth;

      // get next week
      const nextSelectedDate = getNextWeek(selectedDate);

      // get week days of the following in two weeks
      const weekdays = getDaysOfWeek(getNextWeek(nextSelectedDate));

      // get the next week friday
      const nextFriday = endOfWeek(nextSelectedDate, { weekStartsOn: 1 });
      if (isAfter(nextFriday, lastDayOfLastWeekOfMonth(state.month))) {
        console.log("SHOULD FETCH NEXT MONTH");
        fetchBinnacleData(
          nextFriday,
          state.isTimeCalculatedByYear,
          dispatch
        ).catch(error => console.log("nextMonth"));
      }

      // TODO ERROR MODAL
      // TODO IF IS MOBILE THEN FETCH 3 MONTHS TIME BALANCE IN CASE THE USER SELECTS AN PREVIOUS DATE OR NEXT DATE

      switch (nextWeekToMoveOnSwipeLeft.current) {
        case "left_week": {
          setLeftWeekDays(weekdays);
          setWeeksPosition("right");

          nextWeekToMoveOnSwipeLeft.current = "center_week";
          nextWeekToMoveOnSwipeRight.current = "left_week";
          break;
        }
        case "center_week": {
          setCenterWeekDays(weekdays);
          setWeeksPosition("right");

          nextWeekToMoveOnSwipeLeft.current = "right_week";
          nextWeekToMoveOnSwipeRight.current = "center_week";
          break;
        }
        case "right_week": {
          setRightWeekDays(weekdays);
          setWeeksPosition("right");

          nextWeekToMoveOnSwipeLeft.current = "left_week";
          nextWeekToMoveOnSwipeRight.current = "right_week";
        }
      }

      const nextMonday = startOfWeek(nextSelectedDate, { weekStartsOn: 1 });
      handleSelectDate(isThisWeek(nextSelectedDate) ? new Date() : nextMonday);
    } else {
      xAxis.set(lastXAxis.current);
    }
  };

  return (
    <section className="calendar-container">
      <div className={styles.weekHeader}>
        <span
          className={cls(
            styles.weekDay,
            getDay(selectedDate) === 1 && styles.selectedWeekDay
          )}
        >
          LUN
        </span>
        <span
          className={cls(
            styles.weekDay,
            getDay(selectedDate) === 2 && styles.selectedWeekDay
          )}
        >
          MAR
        </span>
        <span
          className={cls(
            styles.weekDay,
            getDay(selectedDate) === 3 && styles.selectedWeekDay
          )}
        >
          MIÉ
        </span>
        <span
          className={cls(
            styles.weekDay,
            getDay(selectedDate) === 4 && styles.selectedWeekDay
          )}
        >
          JUE
        </span>
        <span
          className={cls(
            styles.weekDay,
            getDay(selectedDate) === 5 && styles.selectedWeekDay
          )}
        >
          VIE
        </span>
        <span
          className={cls(
            styles.weekDay,
            getDay(selectedDate) === 6 && styles.selectedWeekDay
          )}
        >
          SÁB
        </span>
        <span
          className={cls(
            styles.weekDay,
            getDay(selectedDate) === 7 && styles.selectedWeekDay
          )}
        >
          DOM
        </span>
      </div>
      <div className="calendar-section">
        <motion.div
          className="calendar-scroll"
          style={{
            width: deviceWidth,
            touchAction: "none",
            x: xAxis
          }}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        >
          <motion.div
            className="calendar-slide"
            style={{
              left: leftWeekPosition
            }}
          >
            {leftWeekDays.map(day => (
              <div
                key={day.getDate()}
                className={
                  isSameDay(day, selectedDate)
                    ? `is-selected ${isToday(day) ? "is-today" : ""}`
                    : ""
                }
                onClick={() => handleSelectDate(day)}
              >
                {day.getDate()}
              </div>
            ))}
          </motion.div>
          <motion.div
            className="calendar-slide"
            style={{
              left: centerWeekPosition
            }}
          >
            {centerWeekDays.map(day => (
              <div
                key={day.getDate()}
                className={
                  isSameDay(day, selectedDate)
                    ? `is-selected ${isToday(day) ? "is-today" : ""}`
                    : ""
                }
                onClick={() => handleSelectDate(day)}
              >
                {day.getDate()}
              </div>
            ))}
          </motion.div>
          <motion.div
            className="calendar-slide"
            style={{
              left: rightWeekPosition
            }}
          >
            {rightWeekDays.map(day => (
              <div
                key={day.getDate()}
                className={
                  isSameDay(day, selectedDate)
                    ? `is-selected ${isToday(day) ? "is-today" : ""}`
                    : ""
                }
                onClick={() => handleSelectDate(day)}
              >
                {day.getDate()}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalendarWeek;

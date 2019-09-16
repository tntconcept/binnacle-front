import React, { useCallback, useRef, useState } from "react";
import {
  motion,
  PanInfo,
  TapInfo,
  useMotionValue,
  useSpring
} from "framer-motion";
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isThisWeek,
  isToday,
  startOfWeek,
  subWeeks
} from "date-fns";
import { customRelativeFormat } from "utils/calendarUtils";

type WeekToUpdate = "left_week" | "center_week" | "right_week";

const getDaysOfWeek = (start: Date) => {
  return eachDayOfInterval({
    start: startOfWeek(start, { weekStartsOn: 1 }),
    end: endOfWeek(start, { weekStartsOn: 1 })
  });
};

const getLastWeek = (currentWeek: Date) => {
  return subWeeks(currentWeek, 1);
};

const getNextWeek = (currentWeek: Date) => {
  return addWeeks(currentWeek, 1);
};

const initialValues = {
  leftWeek: "-100%",
  centerWeek: "-0%",
  rightWeek: "100%",
  xAxis: 0,
  lastXAxis: 0,
  nextWeekToMoveOnSwipeRight: "right_week",
  nextWeekToMoveOnSwipeLeft: "left_week"
};

const MobileBinnacleLayout = () => {
  const width = window.innerWidth;
  const leftWeek = useMotionValue(initialValues.leftWeek);
  const centerWeek = useMotionValue(initialValues.centerWeek);
  const rightWeek = useMotionValue(initialValues.rightWeek);
  const xAxis = useSpring(initialValues.xAxis, { mass: 0.3 });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [leftWeekDays, setLeftWeekDays] = useState(
    getDaysOfWeek(getLastWeek(selectedDate))
  );
  const [centerWeekDays, setCenterWeekDays] = useState(
    getDaysOfWeek(selectedDate)
  );
  const [rightWeekDays, setRightWeekDays] = useState(
    getDaysOfWeek(getNextWeek(selectedDate))
  );

  const lastXAxis = useRef(initialValues.lastXAxis);
  // @ts-ignore
  const nextWeekToMoveOnSwipeRight = useRef<WeekToUpdate>(
    initialValues.nextWeekToMoveOnSwipeRight
  );
  // @ts-ignore
  const nextWeekToMoveOnSwipeLeft = useRef<WeekToUpdate>(
    initialValues.nextWeekToMoveOnSwipeLeft
  );

  const handleReset = () => {
    setSelectedDate(new Date());
    setLeftWeekDays(getDaysOfWeek(getLastWeek(new Date())));
    setCenterWeekDays(getDaysOfWeek(new Date()));
    getDaysOfWeek(getNextWeek(new Date()));
    leftWeek.set(initialValues.leftWeek);
    centerWeek.set(initialValues.centerWeek);
    rightWeek.set(initialValues.rightWeek);
    xAxis.set(initialValues.xAxis);
    lastXAxis.current = initialValues.lastXAxis;
    nextWeekToMoveOnSwipeRight.current =
      initialValues.nextWeekToMoveOnSwipeRight;
    nextWeekToMoveOnSwipeLeft.current = initialValues.nextWeekToMoveOnSwipeLeft;
  };

  const handleClick = useCallback((newDate: Date) => {
    console.log("clicked");
    setSelectedDate(newDate);
  }, []);

  const handlePan = (event: Event, info: PanInfo) => {
    const maxSwipeLeft = info.offset.x > width;
    // console.log("maxSwipeLeft", maxSwipeLeft)
    const maxSwipeRight = info.offset.x < -Math.abs(width);
    // console.log("maxSwipeRight", maxSwipeRight)

    if (!maxSwipeLeft && !maxSwipeRight) {
      xAxis.set(info.offset.x + lastXAxis.current);
    }
  };

  const handlePanEnd = (event: Event, info: PanInfo) => {
    if (info.offset.x > width / 2) {
      xAxis.set(width + lastXAxis.current);
      lastXAxis.current += width;

      const prevSelectedDate = getLastWeek(selectedDate);

      const leftWeekAux = parseFloat(leftWeek.get());
      const centerWeekAux = parseFloat(centerWeek.get());
      const rightWeekAux = parseFloat(rightWeek.get());

      switch (nextWeekToMoveOnSwipeRight.current) {
        case "right_week": {
          setRightWeekDays(getDaysOfWeek(getLastWeek(prevSelectedDate)));

          rightWeek.set(`${leftWeekAux + -100}%`);
          leftWeek.set(`${centerWeekAux + -100}%`);
          centerWeek.set(`${rightWeekAux + -100}%`);

          nextWeekToMoveOnSwipeRight.current = "center_week";
          nextWeekToMoveOnSwipeLeft.current = "right_week";
          break;
        }
        case "center_week": {
          setCenterWeekDays(getDaysOfWeek(getLastWeek(prevSelectedDate)));

          centerWeek.set(`${rightWeekAux + -100}%`);
          rightWeek.set(`${leftWeekAux + -100}%`);
          leftWeek.set(`${centerWeekAux + -100}%`);

          nextWeekToMoveOnSwipeRight.current = "left_week";
          nextWeekToMoveOnSwipeLeft.current = "center_week";
          break;
        }
        case "left_week": {
          setLeftWeekDays(getDaysOfWeek(getLastWeek(prevSelectedDate)));

          leftWeek.set(`${centerWeekAux + -100}%`);
          centerWeek.set(`${rightWeekAux + -100}%`);
          rightWeek.set(`${leftWeekAux + -100}%`);

          nextWeekToMoveOnSwipeRight.current = "right_week";
          nextWeekToMoveOnSwipeLeft.current = "left_week";
          break;
        }
      }

      // right week moves to left week
      // leftWeek move to center week
      // center week moves to right week

      setSelectedDate(
        isThisWeek(prevSelectedDate)
          ? new Date()
          : startOfWeek(prevSelectedDate, { weekStartsOn: 1 })
      );

      console.log("swiped right");
    } else if (info.offset.x < -Math.abs(width / 2)) {
      xAxis.set(lastXAxis.current - width);
      lastXAxis.current -= width;
      const nextSelectedDate = getNextWeek(selectedDate);

      const leftWeekAux = parseFloat(leftWeek.get());
      const centerWeekAux = parseFloat(centerWeek.get());
      const rightWeekAux = parseFloat(rightWeek.get());

      switch (nextWeekToMoveOnSwipeLeft.current) {
        case "left_week": {
          setLeftWeekDays(getDaysOfWeek(getNextWeek(nextSelectedDate)));

          leftWeek.set(`${rightWeekAux + 100}%`);
          rightWeek.set(`${centerWeekAux + 100}%`);
          centerWeek.set(`${leftWeekAux + 100}%`);

          nextWeekToMoveOnSwipeLeft.current = "center_week";
          nextWeekToMoveOnSwipeRight.current = "left_week";
          break;
        }
        case "center_week": {
          setCenterWeekDays(getDaysOfWeek(getNextWeek(nextSelectedDate)));

          centerWeek.set(`${leftWeekAux + 100}%`);
          leftWeek.set(`${rightWeekAux + 100}%`);
          rightWeek.set(`${centerWeekAux + 100}%`);

          nextWeekToMoveOnSwipeLeft.current = "right_week";
          nextWeekToMoveOnSwipeRight.current = "center_week";
          break;
        }
        case "right_week": {
          setRightWeekDays(getDaysOfWeek(getNextWeek(nextSelectedDate)));

          rightWeek.set(`${centerWeekAux + 100}%`);
          centerWeek.set(`${leftWeekAux + 100}%`);
          leftWeek.set(`${rightWeekAux + 100}%`);

          nextWeekToMoveOnSwipeLeft.current = "left_week";
          nextWeekToMoveOnSwipeRight.current = "right_week";
        }
      }

      console.log("swiped left");

      setSelectedDate(
        isThisWeek(nextSelectedDate)
          ? new Date()
          : startOfWeek(nextSelectedDate, { weekStartsOn: 1 })
      );
    } else {
      xAxis.set(lastXAxis.current);
      console.log("swiped center");
    }
  };

  console.count("renders");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >
      <header className="calendar-header">
        {customRelativeFormat(selectedDate)}
        <button
          style={{
            backgroundColor: "white"
          }}
          onClick={handleReset}
        >
          Reset
        </button>
      </header>
      <section className="calendar-container">
        <div className="calendar-section">
          <motion.div
            className="calendar-scroll"
            style={{
              width: width,
              touchAction: "none",
              x: xAxis
            }}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
          >
            <motion.div
              className="calendar-slide"
              style={{
                left: leftWeek
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
                  onClick={() => handleClick(day)}
                >
                  {day.getDate()}
                </div>
              ))}
            </motion.div>
            <motion.div
              className="calendar-slide"
              style={{
                left: centerWeek
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
                  onClick={() => handleClick(day)}
                >
                  {day.getDate()}
                </div>
              ))}
            </motion.div>
            <motion.div
              className="calendar-slide"
              style={{
                left: rightWeek
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
                  onClick={() => handleClick(day)}
                >
                  {day.getDate()}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      <div
        style={{
          height: "50px",
          backgroundColor: "green"
        }}
      >
        Time Stats
      </div>
      <section
        style={{
          flex: "1",
          backgroundColor: "grey"
        }}
      ></section>
    </div>
  );
};

export default MobileBinnacleLayout;

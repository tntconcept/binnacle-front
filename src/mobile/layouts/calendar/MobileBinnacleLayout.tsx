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

const MobileBinnacleLayout = () => {
  const width = window.innerWidth;
  const leftWeek = useMotionValue("-100%");
  const centerWeek = useMotionValue("0%");
  const rightWeek = useMotionValue("100%");
  const xAxis = useSpring(0, { mass: 0.3 });

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

  // <- suma o resta ->

  const lastXAxis = useRef(0);
  const nextWeekToMoveOnSwipeRight = useRef<WeekToUpdate>("right_week");

  const nextWeekToMoveOnSwipeLeft = useRef<WeekToUpdate>("left_week");

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

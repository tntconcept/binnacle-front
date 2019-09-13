import React, { useRef, useState } from "react";
import { motion, PanInfo, useMotionValue, useSpring } from "framer-motion";
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  isThisWeek,
  startOfWeek,
  subWeeks
} from "date-fns";

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
  const xAxis = useSpring(1, { mass: 0.3 });

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

  const handlePan = (event: Event, info: PanInfo) => {
    console.log("handlePan", info.offset.x, width, info);

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
      setRightWeekDays(getDaysOfWeek(getLastWeek(prevSelectedDate)));

      const leftWeekAux = parseFloat(leftWeek.get());
      const centerWeekAux = parseFloat(centerWeek.get());
      const rightWeekAux = parseFloat(rightWeek.get());

      rightWeek.set(`${leftWeekAux + -100}%`);
      leftWeek.set(`${centerWeekAux + -100}%`);
      centerWeek.set(`${rightWeekAux + -100}%`);

      // leftWeek.set(`${parseFloat(leftWeek.get()) + -100}%`);
      // centerWeek.set(`${parseFloat(centerWeek.get()) + -100}%`);
      // rightWeek.set(`${parseFloat(rightWeek.get()) + -100}%`);

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

      leftWeek.set(`${parseFloat(leftWeek.get()) + 100}%`);
      centerWeek.set(`${parseFloat(centerWeek.get()) + 100}%`);
      rightWeek.set(`${parseFloat(rightWeek.get()) + 100}%`);

      console.log("swiped left");

      const nextSelectedDate = getNextWeek(selectedDate);
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
      <header className="calendar-header">{selectedDate.getDate()}</header>
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
              className="calendar-slide red"
              style={{
                left: leftWeek
              }}
            >
              {leftWeekDays.map(day => (
                <div>{day.getDate()}</div>
              ))}
            </motion.div>
            <motion.div
              className="calendar-slide orange"
              style={{
                left: centerWeek
              }}
            >
              {centerWeekDays.map(day => (
                <div>{day.getDate()}</div>
              ))}
            </motion.div>
            <motion.div
              className="calendar-slide aqua"
              style={{
                left: rightWeek
              }}
            >
              {rightWeekDays.map(day => (
                <div>{day.getDate()}</div>
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

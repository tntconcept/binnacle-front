import React, { useRef, useState } from "react";
import { motion, PanInfo, useMotionValue, useSpring } from "framer-motion";
import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
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

  const [leftWeekDays, setLeftWeekDays] = useState(
    getDaysOfWeek(getLastWeek(new Date()))
  );
  const [centerWeekDays, setCenterWeekDays] = useState(
    getDaysOfWeek(new Date())
  );
  const [rightWeekDays, setRightWeekDays] = useState(
    getDaysOfWeek(getNextWeek(new Date()))
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
      // DONE
      xAxis.set(width + lastXAxis.current);
      // right week gets the current center week
      rightWeek.set(centerWeek.get());
      // center week gets the current left week
      centerWeek.set(leftWeek.get());
      // left week changes the x value by times.current
      leftWeek.set(`${parseFloat(leftWeek.get()) + -100}%`);
      // setCenterWeekDays("NEW CENTER WEEK");
      lastXAxis.current += width;
      console.log("swiped right");
    } else if (info.offset.x < -Math.abs(width / 2)) {
      xAxis.set(lastXAxis.current - width);
      leftWeek.set(centerWeek.get());

      centerWeek.set(rightWeek.get());

      rightWeek.set(`${parseFloat(rightWeek.get()) + 100}%`);
      lastXAxis.current -= width;
      console.log("swiped left");
    } else {
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
      <header
        style={{
          height: "60px",
          backgroundColor: "blue"
        }}
      >
        CurrentDate
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

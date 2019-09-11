import React, { useRef, useState } from "react";
import { motion, PanInfo, useMotionValue } from "framer-motion";

const MobileBinnacleLayout = () => {
  const width = window.innerWidth;
  const leftWeek = useMotionValue("-100%");
  const centerWeek = useMotionValue("0%");
  const rightWeek = useMotionValue("100%");

  const [centerWeekDays, setCenterWeekDays] = useState("B");

  const dragTimes = useRef(1);

  // <- suma o resta ->

  const handleDragEnd = (event: Event, info: PanInfo) => {
    console.log("point", info.point.x, info.point.y);
    console.log("offset", info.offset.x, info.offset.y);

    if (info.offset.x > width) {
      // DONE
      leftWeek.set(centerWeek.get());
      centerWeek.set(rightWeek.get());
      rightWeek.set(`${(dragTimes.current + 1) * 100}%`);
      dragTimes.current += 1;
      setCenterWeekDays("NEW CENTER WEEK");
      console.log("swiped left");
    } else if (info.offset.x < 0) {
      rightWeek.set(`${(dragTimes.current - 1) * -100}%`); // -200
      centerWeek.set(leftWeek.get());
      leftWeek.set(centerWeek.get());
      dragTimes.current -= 1;
      console.log("swiped right");
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
              width: width
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <motion.div
              className="calendar-slide red"
              style={{
                left: leftWeek
              }}
            >
              A
            </motion.div>
            <motion.div
              className="calendar-slide orange"
              style={{
                left: centerWeek
              }}
            >
              {centerWeekDays}
            </motion.div>
            <motion.div
              className="calendar-slide aqua"
              style={{
                left: rightWeek
              }}
            >
              C
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

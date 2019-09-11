import React from "react";

const MobileBinnacleLayout = () => {
  const width = window.innerWidth;

  // <- suma o resta->

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
          <div
            className="calendar-scroll"
            style={{
              width: window.innerWidth,
              transform: "translate3d(0px, 0px, 0px)"
            }}
          >
            <div
              className="calendar-slide red"
              style={{
                left: "-100%"
              }}
            >
              A
            </div>
            <div
              className="calendar-slide orange"
              style={{
                left: "0%"
              }}
            >
              B
            </div>
            <div
              className="calendar-slide aqua"
              style={{
                left: "100%"
              }}
            >
              C
            </div>
          </div>
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

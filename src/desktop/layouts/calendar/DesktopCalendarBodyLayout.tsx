import React, { useContext } from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import PlusIcon from "assets/icons/plus.svg";
import {
  addDays,
  addMinutes,
  format,
  getDate,
  getMonth,
  isSameDay,
  isSameMonth,
  isSaturday,
  isSunday,
  isToday,
  parseISO
} from "date-fns";
import { motion } from "framer-motion";
import { SelectedMonthContext } from "core/contexts/BinnaclePageContexts/SelectedMonthContext";
import { CalendarDataContext } from "core/contexts/BinnaclePageContexts/CalendarDataContext";

const Container = styled(
  motion.div,
  cssToObject(`
  box-shadow: 0 3px 15px 0 rgba(0, 0, 0, .15);
  border: solid 1px #dddada;
  background-color: #ffffff;
  margin-left: 32px;
  margin-right: 32px;
  margin-bottom: 32px;
`)
);

const Header = styled(
  "div",
  cssToObject(`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  border-bottom: solid 1px #dddada;
`)
);

const WeekDay = styled(
  "span",
  cssToObject(`
  font-size: 14px;
  line-height: 1.36;
  color: var(--dark);
  text-transform: uppercase;
`)
);

const Grid = styled(
  "div",
  cssToObject(`
  display: grid;
  grid-template-columns: repeat(6, 1fr)
`)
);

const Cell = styled(
  "div",
  (props: { $isOtherMonth?: boolean; $isPublicHoliday?: boolean }) =>
    cssToObject(`
   min-height: 100px;
   max-height: 115px;
   max-width: 229px;
   border-bottom: 1px solid #dddada;
   border-right: 1px solid #dddada;
   padding: 8px;
   
   &:nth-of-type(6n + 6) {
    border-right: 0;
  }
   
   ${
  props.$isOtherMonth
    ? `
    background-color: #f0f0f4;
   `
    : ""
} 
   ${
  props.$isPublicHoliday
    ? `
    background-color: beige;
   `
    : ""
} 

`)
);

const CellHeader = styled(
  "div",
  cssToObject(`
   position: relative;
   display: flex;
   justify-content: space-between;
   min-height: 24px;
`)
);

const CellBody = styled(
  "div",
  cssToObject(`
   max-height: 80px;
   overflow-y: scroll;
`)
);

const DayNumber = styled("span", (props: { $currentDay?: boolean }) =>
  cssToObject(`
    font-size: 12px;
    line-height: 1.36;
    color: #727272;
  ${
  props.$currentDay
    ? `margin-left: -4px;
    padding: 4px 5px;
    border-radius: 50%;
    background-color: #10069f;
    color: white;
  `
    : ""
} 
`)
);

const AnimatedDayNumber = styled(
  motion.div,
  cssToObject(`
    font-size: 12px;
    line-height: 1.36;
    margin-left: -4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #10069f;
    color: white;
`)
);

const ActivityDescription = styled(
  "button",
  (props: { $isBillable?: boolean }) =>
    cssToObject(`
  font-size: 12px;
  line-height: 1.36;
  color: #727272;
  cursor: pointer;
  padding: 4px 8px;
  overflow: hidden; 
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  border: none;
  display: flex;
  background-color: inherit;
  
  &:hover {
    border-radius: 5px; 
    color: black;
    background-color: hsla(0, 0%, 92%, 1);
  }
  ${
  props.$isBillable
    ? `font-weight: bold;
   color: hsl(140, 82%, 31%);
   border-radius: 5px;
   &:hover {
   background-color: hsla(140, 82%, 92%, 1);
  }
   `
    : ""
}
`)
);

const AddButton = styled(
  "button",
  cssToObject(`
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background-color: inherit;
    
    &:hover {
      background-color: #f3f3f3;
    }
`)
);

const Text = styled(
  "span",
  cssToObject(`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
`)
);

const calculateTime = (startTime: Date, amount: number) => {
  const finalTime = addMinutes(startTime, amount);

  return format(startTime, "HH:mm") + " - " + format(finalTime, "HH:mm");
};

const DesktopCalendarBodyLayout: React.FC = () => {
  const { selectedMonth } = useContext(SelectedMonthContext)!;
  const { calendarData } = useContext(CalendarDataContext)!;

  const getCells2 = () => {
    return calendarData.activities.map((activity, index) => {
      const isNotThisMonth = !isSameMonth(activity.date, selectedMonth);

      if (isSunday(activity.date)) {
        return null;
      }

      return (
        <Cell
          key={activity.date.getTime()}
          $isOtherMonth={isNotThisMonth}
          $isPublicHoliday={
            calendarData.holidays.publicHolidays.hasOwnProperty(
              getMonth(activity.date) + 1
            )
              ? calendarData.holidays.publicHolidays[
                getMonth(activity.date) + 1
              ]!.some(holiday => isSameDay(parseISO(holiday), activity.date))
              : false
          }
        >
          {isSaturday(activity.date) ? (
            <React.Fragment>
              <div>
                <div
                  style={{
                    height: "24px"
                  }}
                >
                  <DayNumber>
                    <span>
                      {getDate(activity.date)}{" "}
                      {isNotThisMonth && format(activity.date, "MMMM")}
                    </span>
                  </DayNumber>
                </div>
                <div
                  style={{
                    maxHeight: "30px",
                    overflowY: "scroll"
                  }}
                >
                  {activity.activities.map(activity => {
                    return (
                      <ActivityDescription
                        $isBillable={activity.billable}
                        key={activity.id}
                      >
                        <Text>
                          <b>
                            {calculateTime(
                              activity.startDate,
                              activity.duration
                            )}
                          </b>{" "}
                          {activity.project.name}
                        </Text>
                      </ActivityDescription>
                    );
                  })}
                </div>
              </div>
              <div // ES DOMINGO
                style={{
                  backgroundColor: !isSameMonth(
                    addDays(activity.date, 1),
                    selectedMonth
                  )
                    ? "silver"
                    : "inherit"
                }}
              >
                <DayNumber>
                  <span>
                    {getDate(addDays(activity.date, 1))}{" "}
                    {!isSameMonth(addDays(activity.date, 1), selectedMonth) &&
                      format(addDays(activity.date, 1), "MMMM")}
                  </span>
                </DayNumber>
                <div
                  style={{
                    maxHeight: "30px",
                    overflowY: "scroll"
                  }}
                >
                  {calendarData.activities[index + 1].activities.map(
                    activity => {
                      return (
                        <ActivityDescription
                          $isBillable={activity.billable}
                          key={activity.id}
                        >
                          <Text>
                            <b>
                              {calculateTime(
                                activity.startDate,
                                activity.duration
                              )}
                            </b>{" "}
                            {activity.project.name}
                          </Text>
                        </ActivityDescription>
                      );
                    }
                  )}
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <CellHeader>
                {isToday(activity.date) ? (
                  <AnimatedDayNumber
                    initial={{
                      scale: 0.3
                    }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>{getDate(activity.date)}</span>
                  </AnimatedDayNumber>
                ) : (
                  <DayNumber $currentDay={isToday(activity.date)}>
                    <span>
                      {getDate(activity.date)}{" "}
                      {isNotThisMonth && format(activity.date, "MMMM")}
                    </span>
                  </DayNumber>
                )}

                <AddButton>
                  <img
                    style={{
                      height: "10px"
                    }}
                    src={PlusIcon}
                  />
                </AddButton>
              </CellHeader>
              <CellBody>
                {calendarData.activities.length !== 0 &&
                  calendarData.activities[index].activities.map(activity => {
                    return (
                      <ActivityDescription
                        $isBillable={activity.billable}
                        key={activity.id}
                      >
                        <Text>
                          <b>
                            {calculateTime(
                              activity.startDate,
                              activity.duration
                            )}
                          </b>{" "}
                          {activity.project.name}
                        </Text>
                      </ActivityDescription>
                    );
                  })}
              </CellBody>
            </React.Fragment>
          )}
        </Cell>
      );
    });
  };

  return (
    <Container
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
    >
      <Header>
        <WeekDay>Mon</WeekDay>
        <WeekDay>Tue</WeekDay>
        <WeekDay>Wed</WeekDay>
        <WeekDay>Thu</WeekDay>
        <WeekDay>Fri</WeekDay>
        <WeekDay>Sat/Sun</WeekDay>
      </Header>
      <Grid>{getCells2()}</Grid>
    </Container>
  );
};

export default DesktopCalendarBodyLayout;

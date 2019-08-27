import React from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";
import PlusIcon from "assets/icons/plus.svg";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  isSaturday,
  isSunday,
  isThisMonth,
  isToday,
  startOfMonth,
  startOfWeek
} from "date-fns";

const Container = styled(
  "section",
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

const Cell = styled("div", (props: { $isOtherMonth?: boolean }) =>
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

const Day = styled("span", (props: { $currentDay?: boolean }) =>
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

const getDaysToRender = (date = new Date()) => {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(date)),
    end: endOfWeek(endOfMonth(date))
  });
};

function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(10)) > 5;
}

const CalendarGridLayout: React.FC = () => {
  const calendarDays = getDaysToRender();

  const getCells = () => {
    return calendarDays.map(day => {
      const isNotThisMonth = !isThisMonth(day);

      if (isSaturday(day)) {
        return (
          <Cell
            key={day.getMilliseconds()}
            $isOtherMonth={isNotThisMonth}>
            <div>
              <div
                style={{
                  height: "24px"
                }}
              >
                <Day>
                  <span>
                    {getDate(day)} {isNotThisMonth && format(day, "MMMM")}
                  </span>
                </Day>
              </div>
              <div
                style={{
                  maxHeight: "30px",
                  overflowY: "scroll"
                }}
              >
                <ActivityDescription $isBillable={getRandomInt()}>
                  <Text>
                    <b>09:30 - 12:30</b> TNT API REST
                  </Text>
                </ActivityDescription>
                <ActivityDescription $isBillable={getRandomInt()}>
                  <Text>
                    <b>09:30 - 12:30</b> TNT API REST
                  </Text>
                </ActivityDescription>
              </div>
            </div>
            <div>
              <Day>
                <span>
                  {getDate(addDays(day, 1))}{" "}
                  {!isThisMonth(addDays(day, 1)) &&
                    format(addDays(day, 1), "MMMM")}
                </span>
              </Day>
              <div
                style={{
                  maxHeight: "30px",
                  overflowY: "scroll"
                }}
              >
                <ActivityDescription $isBillable={getRandomInt()}>
                  <Text>
                    <b>09:30 - 12:30</b> TNT API REST
                  </Text>
                </ActivityDescription>
                <ActivityDescription $isBillable={getRandomInt()}>
                  <Text>
                    <b>09:30 - 12:30</b> TNT API REST
                  </Text>
                </ActivityDescription>
                <ActivityDescription $isBillable={getRandomInt()}>
                  <Text>
                    <b>09:30 - 12:30</b> TNT API REST
                  </Text>
                </ActivityDescription>
              </div>
            </div>
          </Cell>
        );
      } else if (isSunday(day)) {
        return null;
      } else {
        return (
          <Cell
            key={day.getMilliseconds()}
            $isOtherMonth={isNotThisMonth}>
            <CellHeader>
              <Day $currentDay={isToday(day)}>
                <span>
                  {getDate(day)} {isNotThisMonth && format(day, "MMMM")}
                </span>
              </Day>
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
              <ActivityDescription $isBillable={getRandomInt()}>
                <Text>
                  <b>09:30 - 12:30</b> TNT API REST
                </Text>
              </ActivityDescription>
              <ActivityDescription $isBillable={getRandomInt()}>
                <Text>
                  <b>09:30 - 12:30</b> TNT API REST REST REST
                </Text>
              </ActivityDescription>
              <ActivityDescription $isBillable={getRandomInt()}>
                <Text>
                  <b>09:30 - 12:30</b> TNT API REST
                </Text>
              </ActivityDescription>
              <ActivityDescription $isBillable={getRandomInt()}>
                <Text>
                  <b>09:30 - 12:30</b> TNT API REST
                </Text>
              </ActivityDescription>
            </CellBody>
          </Cell>
        );
      }
    });
  };

  return (
    <Container>
      <Header>
        <WeekDay>Mon</WeekDay>
        <WeekDay>Tue</WeekDay>
        <WeekDay>Wed</WeekDay>
        <WeekDay>Thu</WeekDay>
        <WeekDay>Fri</WeekDay>
        <WeekDay>Sat/Sun</WeekDay>
      </Header>
      <Grid>{getCells()}</Grid>
    </Container>
  );
};

export default CalendarGridLayout;

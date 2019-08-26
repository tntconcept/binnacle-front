import React from "react";
import { styled } from "styletron-react";
import cssToObject from "css-to-object";

const Container = styled(
  "section",
  cssToObject(`
  box-shadow: 0 3px 15px 0 rgba(0, 0, 0, .15);
  border: solid 1px #dddada;
  background-color: #ffffff;
  margin-left: 32px;
  margin-right: 32px;
`)
);

const Header = styled(
  "div",
  cssToObject(`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
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
  cssToObject(`
   min-height: 100px;
   max-height: 115px;
   max-width: 229px;
   border: solid 1px #dddada;
   padding: 8px;
`)
);

const CellHeader = styled(
  "div",
  cssToObject(`
   position: relative;
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

/* currentDay
* margin-left: -4px;
    padding: 4px 5px;
    border-radius: 50%;
    background-color: #10069f;
    color: white;
* */

const Day = styled(
  "span",
  cssToObject(`
  font-size: 12px;
  line-height: 1.36;
  color: #919191;
`)
);

/* Billable
   font-weight: bold;
   color: hsl(140, 82%, 31%);
   background-color: hsla(140, 82%, 92%, 1);
   border-radius: 5px;
 */
const ActivityDescription = styled(
  "p",
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
  &:hover {
    border-radius: 5px; 
    color: black;
    background-color: grey;
  }
`)
);

const CalendarGridLayout: React.FC = () => {
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
      <Grid>
        <Cell>
          <CellHeader>
            <Day>30</Day>
          </CellHeader>
          <CellBody>
            <ActivityDescription>
              09:30 - 12:30 TNT API REST
            </ActivityDescription>
            <ActivityDescription>
              09:30 - 12:30 TNT API REST REST abracadabra
            </ActivityDescription>
            <ActivityDescription>
              09:30 - 12:30 TNT API REST
            </ActivityDescription>
            <ActivityDescription>
              09:30 - 12:30 TNT API REST
            </ActivityDescription>
          </CellBody>
        </Cell>
        <Cell>
          <Day>1</Day>
          <ActivityDescription>09:30 - 12:30 TNT API REST</ActivityDescription>
        </Cell>
        <Cell>
          <Day>2</Day>
          <ActivityDescription>09:30 - 12:30 TNT API REST</ActivityDescription>
        </Cell>
        <Cell>
          <Day>3</Day>
          <ActivityDescription>09:30 - 12:30 TNT API REST</ActivityDescription>
        </Cell>
        <Cell>
          <Day>4</Day>
          <ActivityDescription>09:30 - 12:30 TNT API REST</ActivityDescription>
        </Cell>
        <Cell>
          <Day>5</Day>
        </Cell>
      </Grid>
    </Container>
  );
};

export default CalendarGridLayout;

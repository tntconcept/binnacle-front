import {differenceInMinutes, getMinutes, setMinutes} from "date-fns"

export const calculateDifferenceInMinutes = (endDate: Date, startDate: Date) => {
  const duration = differenceInMinutes(endDate, startDate);
  return duration / 60;
};

export const getNearestMinutes = (date: Date, interval: number): Date => {
  const roundMinutes = Math.round(getMinutes(date) / interval) * interval;
  return setMinutes(date, roundMinutes);
};

export const getHumanizedDuration = (
  dateLeft: Date,
  dateRight: Date
): string => {
  const durationInMinutes = differenceInMinutes(dateLeft, dateRight);
  const hours = Math.trunc(durationInMinutes / 60);
  const hoursMsg = "h";
  const minutes = durationInMinutes % 60;
  const minutesMsg = "m";

  return `${Math.abs(hours)}${hoursMsg} ${Math.abs(
    minutes
  )}${minutesMsg}`.replace(/^0h | 0m$/, "");
};

export const getHumanizedDurationWithoutMsg = (
  durationInMinutes: number
): string => {
  const hours = Math.trunc(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const minutesPrefix = Math.abs(minutes) < 10 ? "0" : "";

  return `${Math.abs(hours)}:${minutesPrefix}${Math.abs(minutes)}`;
};
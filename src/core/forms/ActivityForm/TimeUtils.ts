import {differenceInMinutes, getMinutes, setMinutes} from "date-fns"

export const calculateDifferenceInMinutes = (endDate: Date, startDate: Date) => {
  const duration = differenceInMinutes(endDate, startDate);
  return duration / 60;
};

export const getNearestMinutes = (date: Date, interval: number): Date => {
  const roundMinutes = Math.round(getMinutes(date) / interval) * interval;
  return setMinutes(date, roundMinutes);
};

export const getDurationWithoutMsg = (
  durationInMinutes: number
): string => {
  const hours = Math.trunc(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const minutesPrefix = Math.abs(minutes) < 10 ? "0" : "";

  return `${Math.abs(hours)}:${minutesPrefix}${Math.abs(minutes)}`;
};
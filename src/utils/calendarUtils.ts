import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek
} from "date-fns";

export const getDatesIntervalByMonth = (selectedMonth: Date) => {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(selectedMonth)),
    end: endOfWeek(endOfMonth(selectedMonth))
  });
};

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek
} from "date-fns";

export const getDatesIntervalByMonth = (selectedMonth: Date) => {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(selectedMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(selectedMonth), { weekStartsOn: 1 })
  });
};

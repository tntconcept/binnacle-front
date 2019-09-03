import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek
} from "date-fns";

export const formatDateForRequest = (date: Date) => format(date, "yyyy-MM-dd");

export const firstDayOfFirstWeekOfMonth = (month: Date) => {
  return startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
};

export const lastDayOfLastWeekOfMonth = (month: Date) => {
  return endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
};

export const getDatesIntervalByMonth = (selectedMonth: Date) => {
  return eachDayOfInterval({
    start: firstDayOfFirstWeekOfMonth(selectedMonth),
    end: lastDayOfLastWeekOfMonth(selectedMonth)
  });
};

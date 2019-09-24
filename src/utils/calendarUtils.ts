import {
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isFuture,
  isPast,
  isToday,
  isYesterday,
  startOfDay,
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

const periods = {
  month: 30 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000
};

export const customRelativeFormat = (dateToFormat: Date) => {
  const diff = differenceInDays(
    startOfDay(dateToFormat),
    startOfDay(Date.now())
  );

  const formats = {
    sameDay: "MMM, 'Today'",
    nextDay: "MMM, 'Tomorrow'",
    nextWeek: "MMM, 'Next' eeee",
    lastDay: "MMM, 'Yesterday'",
    lastWeek: "MMM, 'Last' eeee",
    sameElse: "MMM, dd"
  };

  const formatStr =
    diff < -6
      ? formats.sameElse
      : diff < -1
        ? formats.lastWeek
        : diff < 0
          ? formats.lastDay
          : diff < 1
            ? formats.sameDay
            : diff < 2
              ? formats.nextDay
              : diff < 7
                ? formats.nextWeek
                : formats.sameElse;

  return format(dateToFormat, formatStr, { weekStartsOn: 1 });
};

import { addMinutes, format, getMonth, isSameDay, parseISO } from "date-fns";

export const calculateTime = (startTime: Date, amount: number) => {
  const finalTime = addMinutes(startTime, amount);

  return format(startTime, "HH:mm") + " - " + format(finalTime, "HH:mm");
};

export const isPublicHoliday = (publicHolidays: any, date: Date) => {
  if (publicHolidays.hasOwnProperty(getMonth(date) + 1)) {
    return publicHolidays[getMonth(date) + 1]!.some((holiday: any) =>
      isSameDay(parseISO(holiday), date)
    );
  } else {
    return false;
  }
};

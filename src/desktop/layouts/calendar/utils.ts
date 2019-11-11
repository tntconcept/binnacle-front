import {addMinutes, format, getMonth, isSameDay, parseISO} from "date-fns"

export const calculateTime = (startTime: Date, amount: number) => {
  const finalTime = addMinutes(startTime, amount);

  return format(startTime, "HH:mm") + " - " + format(finalTime, "HH:mm");
};

export const checkPublicHoliday = (
  publicHolidays: Record<string, string[]>,
  date: Date
) => {
  return publicHolidays[getMonth(date) + 1].find((holidayDate: string) =>
    isSameDay(parseISO(holidayDate), date)
  );
};

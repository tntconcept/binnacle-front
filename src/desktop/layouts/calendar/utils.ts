import {addMinutes, format, isSameDay} from "date-fns"
import {IHolidaysResponse} from "interfaces/IHolidays"

export const calculateTime = (startTime: Date, amount: number) => {
  const finalTime = addMinutes(startTime, amount);

  return format(startTime, "HH:mm") + " - " + format(finalTime, "HH:mm");
};

export const isPublicHoliday = (
  publicHolidays: IHolidaysResponse["publicHolidays"],
  date: Date
) => publicHolidays.find(holiday => isSameDay(holiday.date, date));

export const isPrivateHoliday = (
  privateHolidays: IHolidaysResponse["privateHolidays"],
  date: Date
) =>
  privateHolidays.find(holiday =>
    holiday.days.some(day => isSameDay(day, date))
  );

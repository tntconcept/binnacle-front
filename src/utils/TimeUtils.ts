import {roundToTwoDecimals} from "utils/helpers"
import {addMinutes, format, getMinutes, setMinutes} from "date-fns"

const getHumanizedDuration = (durationInMinutes: number): string => {
  const hours = Math.trunc(durationInMinutes / 60);
  const hoursMsg = "h";
  const minutes = durationInMinutes % 60;
  const minutesMsg = "m";

  return `${Math.abs(hours)}${hoursMsg} ${Math.abs(
    minutes
  )}${minutesMsg}`.replace(/^0h | 0m$/, "");
};

export const getDuration = (minutes: number, decimalFormat: boolean = false) => {
  if (decimalFormat) {
    return roundToTwoDecimals(Math.abs(minutes) / 60)
  }

  return getHumanizedDuration(minutes)
}

export const getTimeInterval = (startTime: Date, amount: number) => {
  const finalTime = addMinutes(startTime, amount)
  return format(startTime, "HH:mm") + " - " + format(finalTime, "HH:mm")
}
export const roundHourToQuarters = (date: Date): Date => {
  const roundMinutes = Math.round(getMinutes(date) / 15) * 15
  return setMinutes(date, roundMinutes)
}

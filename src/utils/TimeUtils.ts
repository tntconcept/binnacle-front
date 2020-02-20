export const getHumanizedDuration = (durationInMinutes: number): string => {
  const hours = Math.trunc(durationInMinutes / 60);
  const hoursMsg = "h";
  const minutes = durationInMinutes % 60;
  const minutesMsg = "m";

  return `${Math.abs(hours)}${hoursMsg} ${Math.abs(
    minutes
  )}${minutesMsg}`.replace(/^0h | 0m$/, "");
};

export const roundToTwo = (num: number) => {
  return Math.round( (num + Number.EPSILON) * 100) / 100
}

export const getDuration = (minutes: number, decimalFormat: boolean = false) => {
  if (decimalFormat) {
    return roundToTwo(Math.abs(minutes) / 60)
  }

  return getHumanizedDuration(minutes)
}
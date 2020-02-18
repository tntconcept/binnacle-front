export const getHumanizedDuration = (durationInMinutes: number): string => {
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
    return Math.round((Math.abs(minutes) / 60 + Number.EPSILON) * 100) / 100
  }

  return getHumanizedDuration(minutes)
}
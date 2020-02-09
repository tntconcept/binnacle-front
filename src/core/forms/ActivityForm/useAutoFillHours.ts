import {addHours, isAfter, isBefore, isSameHour, lightFormat, parse} from "date-fns"
import {useMemo} from "react"

const firstActivityStartTime = new Date("2019-01-01 09:00")
const firstActivityEndTime = new Date("2019-01-01 13:00")
const secondActivityFirstTime = new Date("2019-01-01 14:00")
const secondActivityEndTime = new Date("2019-01-01 18:00")

/*
*  Entro a trabajar a las:
*  Voy a comer a las:
*  Suelo comer en:
*  Me voy a casa  a las:
*/

export const useAutoFillHours = (lastEndTime: string | undefined = undefined) => {

  const lastEndTimeParsed = parse(lastEndTime!, "HH:mm", new Date("2019-01-01"))

  const getStartTime = () => {
    // lastTime = undefined -> default first start time
    if (!lastEndTime) {
      return lightFormat(firstActivityStartTime, "HH:mm")
    }

    // lastTime = first end time -> default second first time
    if (isSameHour(firstActivityEndTime, lastEndTimeParsed)) {
      return lightFormat(secondActivityFirstTime, "HH:mm")
    }


    // Is the first date before the second one?
    // lastTime is before second first time -> lastTime
    if (isBefore(lastEndTimeParsed, secondActivityFirstTime)) {
      return lastEndTime
    }

    // Is the first date after the second one?
    // lastTime is after second first time -> lastTime
    if (isAfter(lastEndTimeParsed, secondActivityFirstTime)) {
      return lastEndTime
    }
  }

  const getEndTime = () => {
    // lastTime = undefined -> default first end time
    if (!lastEndTime) {
      return lightFormat(firstActivityEndTime, "HH:mm")
    }

    // lastTime = first end time -> default second end time
    if (isSameHour(firstActivityEndTime, lastEndTimeParsed)) {
      return lightFormat(secondActivityEndTime, "HH:mm")
    }

    // Is the first date before the second one?
    // lastTime is before first end time -> first end time
    if (isBefore(lastEndTimeParsed, firstActivityEndTime)) {
      return lightFormat(firstActivityEndTime, "HH:mm")
    }

    // Is the first date before the second one?
    // lastTime is before second end time -> second end time
    if (isBefore(lastEndTimeParsed, secondActivityEndTime)) {
      return lightFormat(secondActivityEndTime, "HH:mm")
    }

    // Is the first date after the second one?
    // lastTime is after second end time -> lastTime + 1
    if (isAfter(lastEndTimeParsed, secondActivityEndTime)) {
      return lightFormat(addHours(lastEndTimeParsed, 1), "HH:mm");
    }
  }

  const result = useMemo(() => ({
    startTime: getStartTime(),
    endTime: getEndTime()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [lastEndTime])

  return result
}
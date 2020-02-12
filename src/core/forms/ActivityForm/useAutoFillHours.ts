import {addHours, isAfter, isBefore, isSameHour, lightFormat} from "date-fns"
import {useContext, useMemo} from "react"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import {timeToDate} from "utils/calendarUtils"

export const useAutoFillHours = (lastEndTime: Date | undefined = undefined) => {
  const { state } = useContext(SettingsContext);

  const firstActivityStartTime = timeToDate(state.hoursInterval[0], lastEndTime)
  const firstActivityEndTime = timeToDate(state.hoursInterval[1], lastEndTime)
  const secondActivityFirstTime = timeToDate(state.hoursInterval[2], lastEndTime)
  const secondActivityEndTime = timeToDate(state.hoursInterval[3], lastEndTime)


  const getStartTime = () => {
    // lastTime = undefined -> default first start time
    if (!lastEndTime) {
      return lightFormat(firstActivityStartTime, "HH:mm")
    }

    // lastTime = first end time -> default second first time
    if (isSameHour(firstActivityEndTime, lastEndTime)) {
      return lightFormat(secondActivityFirstTime, "HH:mm")
    }


    // Is the first date before the second one?
    // lastTime is before second first time -> lastTime
    if (isBefore(lastEndTime, secondActivityFirstTime)) {
      return lightFormat(lastEndTime, "HH:mm")
    }

    // Is the first date after the second one?
    // lastTime is after second first time -> lastTime
    if (isAfter(lastEndTime, secondActivityFirstTime)) {
      return lightFormat(lastEndTime, "HH:mm")
    }
  }

  const getEndTime = () => {
    // lastTime = undefined -> default first end time
    if (!lastEndTime) {
      return lightFormat(firstActivityEndTime, "HH:mm")
    }

    // lastTime = first end time -> default second end time
    if (isSameHour(firstActivityEndTime, lastEndTime)) {
      return lightFormat(secondActivityEndTime, "HH:mm")
    }

    // Is the first date before the second one?
    // lastTime is before first end time -> first end time
    if (isBefore(lastEndTime, firstActivityEndTime)) {
      return lightFormat(firstActivityEndTime, "HH:mm")
    }

    // Is the first date before the second one?
    // lastTime is before second end time -> second end time
    if (isBefore(lastEndTime, secondActivityEndTime)) {
      return lightFormat(secondActivityEndTime, "HH:mm")
    }

    // Is the first date after the second one?
    // lastTime is after second end time -> lastTime + 1
    if (isAfter(lastEndTime, secondActivityEndTime)) {
      return lightFormat(addHours(lastEndTime, 1), "HH:mm");
    }
  }

  const result = useMemo(() => ({
    startTime: getStartTime()!,
    endTime: getEndTime()!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [lastEndTime])

  return result
}
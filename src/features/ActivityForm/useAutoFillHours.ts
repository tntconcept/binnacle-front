import {addHours, isAfter, isBefore, isSameHour, lightFormat} from "date-fns"
import {useMemo} from "react"
import {timeToDate} from "utils/DateUtils"
import {roundHourToQuarters} from "utils/TimeUtils"

export const useAutoFillHours = (
  autoFillHours: boolean,
  hoursInterval: string[],
  lastEndTime: Date | undefined = undefined
) => {
  const firstActivityStartTime = timeToDate(hoursInterval[0], lastEndTime);
  const firstActivityEndTime = timeToDate(hoursInterval[1], lastEndTime);
  const secondActivityFirstTime = timeToDate(hoursInterval[2], lastEndTime);
  const secondActivityEndTime = timeToDate(hoursInterval[3], lastEndTime);

  const getStartTime = () => {
    if (!lastEndTime) {
      return lightFormat(firstActivityStartTime, "HH:mm");
    }

    if (isSameHour(firstActivityEndTime, lastEndTime)) {
      return lightFormat(secondActivityFirstTime, "HH:mm");
    }

    if (isBefore(lastEndTime, secondActivityFirstTime)) {
      return lightFormat(lastEndTime, "HH:mm");
    }

    if (isAfter(lastEndTime, secondActivityFirstTime)) {
      return lightFormat(lastEndTime, "HH:mm");
    }
  };

  const getEndTime = () => {
    if (!lastEndTime) {
      return lightFormat(firstActivityEndTime, "HH:mm");
    }

    if (isSameHour(firstActivityEndTime, lastEndTime)) {
      return lightFormat(secondActivityEndTime, "HH:mm");
    }

    if (isBefore(lastEndTime, firstActivityEndTime)) {
      return lightFormat(firstActivityEndTime, "HH:mm");
    }

    if (isBefore(lastEndTime, secondActivityEndTime)) {
      return lightFormat(secondActivityEndTime, "HH:mm");
    }

    if (isAfter(lastEndTime, secondActivityEndTime) || isSameHour(lastEndTime, secondActivityEndTime)) {
      return lightFormat(addHours(lastEndTime, 1), "HH:mm");
    }
  };

  const result = useMemo(() => {
    if (!autoFillHours) {
      const date = roundHourToQuarters(lastEndTime || new Date())
      return {
        startTime: lightFormat(date, "HH:mm"),
        endTime: lightFormat(addHours(date, 1), "HH:mm")
      };
    }

    return {
      startTime: getStartTime()!,
      endTime: getEndTime()!
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFillHours, lastEndTime, hoursInterval]);

  return result;
};

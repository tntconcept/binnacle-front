import React, {useEffect, useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import TextField from "core/components/TextField/TextField"
import {useFormikContext} from "formik"
import {differenceInMinutes, lightFormat, set} from "date-fns"
import {timeToDate} from "utils/DateUtils"
import {roundToTwo} from "utils/TimeUtils"

const DurationField = () => {
  const { t } = useTranslation();
  const [duration, setDuration] = useState("0");
  const {values, setFieldValue} = useFormikContext<any>()
  const ignoreEffect = useRef(false)

  const handleSetDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    ignoreEffect.current = true
    const value = event.currentTarget.value;
    const duration = Number(value) * 60;

    const startDate = timeToDate(values.startTime)
    const newEndDate = set(startDate, { hours: startDate.getHours() + duration / 60, minutes: duration%60 })
    setFieldValue("endTime", lightFormat(newEndDate  , "HH:mm"))
    setDuration(value)
  };

  useEffect(() => {
    if (ignoreEffect.current) {
      ignoreEffect.current = false
      return
    }

    const startTime = timeToDate(values.startTime)
    const endTime = timeToDate(values.endTime)
    const newDuration = differenceInMinutes(endTime, startTime) / 60

    setDuration(roundToTwo(newDuration).toString())
  }, [values.endTime, values.startTime])

  return (
    <TextField
      label={t("activity_form.duration")}
      value={duration}
      type="number"
      onChange={handleSetDuration}
    />
  );
};

export default DurationField;

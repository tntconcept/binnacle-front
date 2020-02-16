import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import TextField from "core/components/TextField/TextField"
import {useFormikContext} from "formik"
import {lightFormat, set} from "date-fns"
import {timeToDate} from "utils/DateUtils"

const DurationField = () => {
  const { t } = useTranslation();
  const [duration, setDuration] = useState("0");
  const formik = useFormikContext()

  const handleSetDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const duration = Number(value) * 60;
    console.log(duration)

    // TODO activity's date or lastEndTime or currentDate as fallbackDate
    // @ts-ignore
    const endDate = timeToDate(formik.values.endTime)
    const newEndDate = set(endDate, { hours: endDate.getHours() + duration / 60, minutes: duration%60 })
    formik.setFieldValue("endTime", lightFormat(newEndDate  , "HH:mm"))

    setDuration(value)
  };

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

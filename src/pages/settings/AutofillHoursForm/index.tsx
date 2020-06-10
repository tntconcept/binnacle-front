import React, {memo, useEffect, useMemo, useState} from "react"
import {areIntervalsOverlapping} from "date-fns"
import {timeToDate} from "utils/DateUtils"
import {SettingsActions} from "features/SettingsContext/SettingsActions"
import {FieldMessage, Stack, TextField} from "common/components"
import {useTranslation} from "react-i18next"
import classes from "./AutofillHoursForm.module.css"

interface IAutofillHoursForm {
  hoursInterval: string[];
  dispatch: any;
}

const AutofillHoursForm: React.FC<IAutofillHoursForm> =
  ({ hoursInterval, dispatch }) => {
    const { t } = useTranslation();
    const [hours, setHours] = useState({
      startWorkingTime: hoursInterval[0] || "09:00",
      startLunchBreak: hoursInterval[1] || "13:00",
      endLunchBreak: hoursInterval[2] || "14:00",
      endWorkingTime: hoursInterval[3] || "18:00"
    });

    const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target;
      setHours(prevState => ({ ...prevState, [target.name]: target.value }));
    };

    const areHoursOverlapping = useMemo(() => {
      try {
        return areIntervalsOverlapping(
          {
            start: timeToDate(hours.startWorkingTime),
            end: timeToDate(hours.startLunchBreak)
          },
          {
            start: timeToDate(hours.endLunchBreak),
            end: timeToDate(hours.endWorkingTime)
          }
        );
      } catch (e) {
        return true;
      }
    }, [hours]);

    useEffect(() => {
      if (!areHoursOverlapping) {
        dispatch(
          SettingsActions.saveHoursInterval([
            hours.startWorkingTime,
            hours.startLunchBreak,
            hours.endLunchBreak,
            hours.endWorkingTime
          ])
        );
      }
    }, [hours, areHoursOverlapping, dispatch]);

    return (
      <div className={classes.container}>
        <Stack
          // @ts-ignore
          role="group"
          aria-labelledby="autofill_form_title"
        >
          <p id="autofill_form_title">{t("settings.working_time")}</p>
          <div className={classes.block}>
            <TextField
              name="startWorkingTime"
              label={t("settings.start")}
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={hours.startWorkingTime}
              onChange={handleHourChange}
            />
            <TextField
              name="endWorkingTime"
              label={t("settings.end")}
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={hours.endWorkingTime}
              onChange={handleHourChange}
            />
          </div>
          <p>{t("settings.lunch_break")}</p>
          <div className={classes.block}>
            <TextField
              name="startLunchBreak"
              label={t("settings.from")}
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={hours.startLunchBreak}
              onChange={handleHourChange}
            />
            <TextField
              name="endLunchBreak"
              label={t("settings.to")}
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={hours.endLunchBreak}
              onChange={handleHourChange}
            />
          </div>
        </Stack>
        {areHoursOverlapping && (
          <FieldMessage
            id=''
            error={areHoursOverlapping}
            errorText={t("settings.intervals_overlap")}
          />
        )}
      </div>
    );
  }
;

export default memo(AutofillHoursForm);

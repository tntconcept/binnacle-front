import React, {memo, useEffect, useMemo, useState} from "react"
import {areIntervalsOverlapping} from "date-fns"
import {timeToDate} from "utils/DateUtils"
import {SettingsActions} from "core/contexts/SettingsContext/settingsActions"
import TextField from "core/components/TextField/TextField"
import FieldMessage from "core/components/FieldMessage"
import {useTranslation} from "react-i18next"
import classes from "./AutofillHoursForm.module.css"
import Stack from "core/forms/LoginForm/Stack"

interface IAutofillHoursForm {
  hoursInterval: string[];
  dispatch: any;
}

const AutofillHoursForm: React.FC<IAutofillHoursForm> = memo(
  ({ hoursInterval, dispatch }) => {
    const { t } = useTranslation();
    const [hours, setHours] = useState({
      firstStartTime: hoursInterval[0] || "09:00",
      firstEndTime: hoursInterval[1] || "13:00",
      secondStartTime: hoursInterval[2] || "14:00",
      secondEndTime: hoursInterval[3] || "18:00"
    });

    const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target;
      setHours(prevState => ({ ...prevState, [target.name]: target.value }));
    };

    const areHoursOverlapping = useMemo(() => {
      try {
        // TODO cuando las horas son iguales deja guardar...
        return areIntervalsOverlapping(
          {
            start: timeToDate(hours.firstStartTime),
            end: timeToDate(hours.firstEndTime)
          },
          {
            start: timeToDate(hours.secondStartTime),
            end: timeToDate(hours.secondEndTime)
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
            hours.firstStartTime,
            hours.firstEndTime,
            hours.secondStartTime,
            hours.secondEndTime
          ])
        );
      }
    }, [hours, areHoursOverlapping, dispatch]);

    return (
      <div className={classes.container}>
        <Stack>
          <p>Jornada laboral</p>
          <div className={classes.block}>
            <TextField
              name="firstStartTime"
              label={"Inicio"}
              type="time"
              value={hours.firstStartTime}
              onChange={handleHourChange}
            />
            <TextField
              name="secondEndTime"
              label={"Fin"}
              type="time"
              value={hours.secondEndTime}
              onChange={handleHourChange}
            />
          </div>
          <p>Pausa para comer</p>
          <div className={classes.block}>
            <TextField
              name="firstEndTime"
              label={"Desde"}
              type="time"
              value={hours.firstEndTime}
              onChange={handleHourChange}
            />
            <TextField
              name="secondStartTime"
              label={"Hasta"}
              type="time"
              value={hours.secondStartTime}
              onChange={handleHourChange}
            />
          </div>
        </Stack>
        {areHoursOverlapping && (
          <FieldMessage
            isError={areHoursOverlapping}
            errorText={t("settings.hours_overlapping")}
          />
        )}
      </div>
    );
  }
);

export default AutofillHoursForm;

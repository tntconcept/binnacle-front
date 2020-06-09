import React, {useContext} from "react"
import {useTranslation} from "react-i18next"
import {differenceInMinutes, parse} from "date-fns"
import {getDuration} from "utils/TimeUtils"
import {useFormikContext} from "formik"
import {ActivityFormValues} from "features/ActivityForm/ActivityForm"
import {SettingsContext} from "features/SettingsContext/SettingsContext"

const DurationText = () => {
  const { t } = useTranslation();
  const formik = useFormikContext<ActivityFormValues>();
  const { state: settingsState } = useContext(SettingsContext);

  const calculateDuration = (startTime: string, endTime: string) => {
    const dateLeft = parse(startTime, "HH:mm", new Date());
    const dateRight = parse(endTime, "HH:mm", new Date());

    const difference = differenceInMinutes(dateLeft, dateRight);

    return getDuration(difference, settingsState.useDecimalTimeFormat);
  };

  return (
    <React.Fragment>
      <span>{t("activity_form.duration")}</span>
      <span>
        {formik.errors.endTime && formik.touched.endTime
          ? "-"
          : calculateDuration(formik.values.startTime, formik.values.endTime)}
      </span>
    </React.Fragment>
  );
};

export default DurationText;

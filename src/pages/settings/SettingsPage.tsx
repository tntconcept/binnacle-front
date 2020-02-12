import React, {useContext} from "react"
import {SettingsContext, withSettingsProvider} from "core/contexts/SettingsContext/SettingsContext"
import Checkbox from "core/components/Checkbox"
import Navbar from "core/components/Navbar"
import {useTranslation} from "react-i18next"
import {SettingsActions} from "core/contexts/SettingsContext/settingsActions"

const SettingsPage = () => {
  const { t } = useTranslation()
  const { state, dispatch } = useContext(SettingsContext);



  return (
    <React.Fragment>
      <Navbar />
      <Checkbox
        name="hideSaturday"
        label={t("settings.hide_saturday")}
        checked={state.hideSaturday}
        onChange={() => dispatch(SettingsActions.toggleSaturdayVisibility())}
      />
      <Checkbox
        name="hideSunday"
        label={t("settings.hide_sunday")}
        checked={state.hideSunday}
        onChange={() => dispatch(SettingsActions.toggleSundayVisibility())}
      />
      <Checkbox
        name='showDurationInput'
        label={t("settings.show_duration_input")}
        checked={state.showDurationInput}
        onChange={() => dispatch(SettingsActions.toggleDurationInput())}
      />
      <Checkbox
        name='useDecimalTimeFormat'
        label={t("settings.use_decimal_time_format")}
        checked={state.useDecimalTimeFormat}
        onChange={() => dispatch(SettingsActions.toggleDecimalTimeFormat())}
      />
    </React.Fragment>
  );
};

export default withSettingsProvider(SettingsPage);

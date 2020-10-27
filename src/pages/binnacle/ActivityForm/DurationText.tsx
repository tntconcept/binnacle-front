import React from 'react'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'
import { ActivityFormValues } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import { useSettings } from 'pages/settings/Settings.utils'
import chrono, { parse } from 'core/services/Chrono'
import { getDuration } from 'pages/binnacle/BinnaclePage.utils'

const DurationText = () => {
  const { t } = useTranslation()
  const formik = useFormikContext<ActivityFormValues>()
  const settings = useSettings()

  const calculateDuration = (startTime: string, endTime: string) => {
    const dateLeft = parse(startTime, 'HH:mm', new Date())
    const dateRight = parse(endTime, 'HH:mm', new Date())
    const difference = chrono(dateRight).diff(dateLeft, 'minute')

    return getDuration(difference, settings.useDecimalTimeFormat)
  }

  return (
    <React.Fragment>
      <span>{t('activity_form.duration')}</span>
      <span>
        {formik.errors.endTime && formik.touched.endTime
          ? '-'
          : calculateDuration(formik.values.startTime, formik.values.endTime)}
      </span>
    </React.Fragment>
  )
}

export default DurationText

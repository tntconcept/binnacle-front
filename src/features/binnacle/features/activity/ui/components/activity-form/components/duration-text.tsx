import { getDurationByMinutes } from 'features/binnacle/features/activity/utils/getDuration'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TimeUnit, TimeUnits } from 'shared/types/time-unit'
import chrono, { getHumanizedDuration } from 'shared/utils/chrono'

interface Props {
  start: Date
  end: Date
  useDecimalTimeFormat: boolean
  timeUnit: TimeUnit
}

const DurationText = (props: Props) => {
  const { start, end, timeUnit = TimeUnits.MINUTES, useDecimalTimeFormat } = props
  const { t } = useTranslation()

  const duration = useMemo(() => {
    const diffUnit = timeUnit === TimeUnits.DAYS ? 'businessDay' : 'minute'
    const endDate = timeUnit === TimeUnits.DAYS ? chrono(end).plus(1, 'day').getDate() : end
    const difference = chrono(endDate).diff(start, diffUnit)

    return timeUnit === TimeUnits.MINUTES
      ? getDurationByMinutes(difference, useDecimalTimeFormat)
      : getHumanizedDuration({
          duration: difference,
          abbreviation: true,
          timeUnit
        })
  }, [start, end, timeUnit])

  return (
    <Fragment>
      <span>{t('activity_form.duration')}</span>
      <span>{duration}</span>
    </Fragment>
  )
}

export default DurationText

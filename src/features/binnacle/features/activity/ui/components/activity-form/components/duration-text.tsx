import { getDurationByMinutes } from 'features/binnacle/features/activity/utils/getDuration'
import { Fragment } from 'react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import chrono, { parse } from 'shared/utils/chrono'
import { ActivityFormSchema } from '../activity-form.schema'

interface Props {
  control: Control<ActivityFormSchema>
  useDecimalTimeFormat: boolean
}

const DurationText = (props: Props) => {
  const [startTime, endTime] = useWatch({
    control: props.control,
    name: ['startTime', 'endTime']
  })

  const { t } = useTranslation()

  const calculateDuration = (startTime: string, endTime: string) => {
    const dateLeft = parse(startTime, 'HH:mm', chrono.now())
    const dateRight = parse(endTime, 'HH:mm', chrono.now())
    const difference = chrono(dateRight).diff(dateLeft, 'minute')
    return getDurationByMinutes(difference, props.useDecimalTimeFormat)
  }

  return (
    <Fragment>
      <span>{t('activity_form.duration')}</span>
      <span>{calculateDuration(startTime, endTime)}</span>
    </Fragment>
  )
}

export default DurationText

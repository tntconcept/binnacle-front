import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import { getDurationByMinutes } from 'modules/binnacle/data-access/utils/getDuration'
import { Fragment } from 'react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import chrono, { parse } from 'shared/utils/chrono'

interface Props {
  control: Control<ActivityFormSchema>
}

const DurationText = (props: Props) => {
  const [startTime, endTime] = useWatch({
    control: props.control,
    name: ['startTime', 'endTime']
  })

  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)

  const calculateDuration = (startTime: string, endTime: string) => {
    const dateLeft = parse(startTime, 'HH:mm', chrono.now())
    const dateRight = parse(endTime, 'HH:mm', chrono.now())
    const difference = chrono(dateRight).diff(dateLeft, 'minute')
    return getDurationByMinutes(difference, settings.useDecimalTimeFormat)
  }

  return (
    <Fragment>
      <span>{t('activity_form.duration')}</span>
      <span>{calculateDuration(startTime, endTime)}</span>
    </Fragment>
  )
}

export default DurationText

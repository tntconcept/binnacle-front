import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'
import { timeToDate } from 'utils/DateUtils'
import { roundToTwoDecimals } from 'utils/helpers'
import chrono from 'services/Chrono'
import { FloatingLabelInput } from 'core/components/FloatingLabelInput'
import { useColorModeValue } from '@chakra-ui/core'

const DurationInput = () => {
  const { t } = useTranslation()
  const [duration, setDuration] = useState('0')
  const { values, setFieldValue } = useFormikContext<any>()
  const ignoreEffect = useRef(false)
  const labelBgColor = useColorModeValue('white', ['gray.800', 'gray.700'])

  const handleSetDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    ignoreEffect.current = true
    const value = event.currentTarget.value.replace(',', '.').replace(/[^0-9.]/g, '')

    const duration = Number(value) * 60

    // Consider Intl.NumberFormat() ? to allow the user to input with . or , based on locale.
    const startDate = timeToDate(values.startTime)

    setFieldValue(
      'endTime',
      chrono(startDate)
        .set(startDate.getHours() + duration / 60, 'hour')
        .set(duration % 60, 'minute')
        .format(chrono.TIME_FORMAT)
    )
    setDuration(value)
  }

  useEffect(() => {
    if (ignoreEffect.current) {
      ignoreEffect.current = false
      return
    }

    const startTime = timeToDate(values.startTime)
    const endTime = timeToDate(values.endTime)
    const newDuration = chrono(startTime).diff(endTime, 'minute') / 60

    setDuration(roundToTwoDecimals(newDuration).toString())
  }, [values.endTime, values.startTime])

  return (
    <FloatingLabelInput
      label={t('activity_form.duration')}
      labelBgColor={labelBgColor}
      value={duration}
      name="duration"
      type="number"
      onChange={handleSetDuration}
    />
  )
}

export default DurationInput

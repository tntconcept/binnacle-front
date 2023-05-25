import { getDurationByMinutes } from 'features/binnacle/features/activity/utils/getDuration'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TimeUnit, TimeUnits } from 'shared/types/time-unit'
import chrono, { getHumanizedDuration } from 'shared/utils/chrono'
import { Flex, Text } from '@chakra-ui/react'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { GetDaysForActivityDaysPeriodQry } from '../../../../application/get-days-for-activity-days-period-qry'
import { DateInterval } from '../../../../../../../../shared/types/date-interval'

interface Props {
  start: Date
  end: Date
  useDecimalTimeFormat: boolean
  timeUnit: TimeUnit
  maxAllowed?: number
  remaining?: number
}

const DurationText = (props: Props) => {
  const {
    start,
    end,
    timeUnit = TimeUnits.MINUTES,
    useDecimalTimeFormat,
    maxAllowed = 0,
    remaining = 0
  } = props
  const { t } = useTranslation()
  const [daysQt, setDaysQt] = useState<null | number>(null)
  const { isLoading, executeUseCase: getDaysForActivityDaysPeriodQry } = useGetUseCase(
    GetDaysForActivityDaysPeriodQry
  )

  const formatTimePerTimeUnit = useCallback(
    (timeToFormat) => {
      return timeUnit === TimeUnits.MINUTES
        ? getDurationByMinutes(timeToFormat)
        : getHumanizedDuration({
            duration: timeToFormat,
            abbreviation: true,
            timeUnit
          })
    },
    [timeUnit]
  )

  const duration = useMemo(() => {
    const diffUnit = timeUnit === TimeUnits.DAYS ? 'businessDay' : 'minute'
    const difference = chrono(start).diff(end, diffUnit)

    return timeUnit === TimeUnits.MINUTES
      ? getDurationByMinutes(difference, useDecimalTimeFormat)
      : getHumanizedDuration({
          duration: daysQt || 0,
          abbreviation: true,
          timeUnit
        })
  }, [timeUnit, end, start, useDecimalTimeFormat, daysQt])

  useEffect(() => {
    const dateInterval: DateInterval = { start, end }
    getDaysForActivityDaysPeriodQry(dateInterval).then(setDaysQt)
  }, [start, end, getDaysForActivityDaysPeriodQry])

  return (
    <>
      <Flex justify="space-between" w="100%" h="100%">
        <span>{t('activity_form.duration')}</span>
        {isLoading ? <span>{t('accessibility.loading')}</span> : <span>{duration}</span>}
      </Flex>
      <Text
        align="right"
        display="block"
        fontSize="xs"
        color="gray.500"
        w="100%"
        position="absolute"
        right="0"
        top="38px"
      >
        {maxAllowed > 0 &&
          t('activity_form.remaining', {
            remaining: formatTimePerTimeUnit(remaining),
            maxAllowed: formatTimePerTimeUnit(maxAllowed)
          })}
      </Text>
    </>
  )
}

export default DurationText

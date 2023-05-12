import { getDurationByMinutes } from 'features/binnacle/features/activity/utils/getDuration'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TimeUnit, TimeUnits } from 'shared/types/time-unit'
import chrono, { getHumanizedDuration } from 'shared/utils/chrono'
import { Flex, Text } from '@chakra-ui/react'

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
    <>
      <Flex justify="space-between" w="100%">
        <span>{t('activity_form.duration')}</span>
        <span>{duration}</span>
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

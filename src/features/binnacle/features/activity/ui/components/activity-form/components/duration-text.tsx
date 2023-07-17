import { Flex, Text } from '@chakra-ui/react'
import { getDurationByMinutes } from '../../../../utils/get-duration'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import { TimeUnit, TimeUnits } from '../../../../../../../../shared/types/time-unit'
import { chrono, getHumanizedDuration } from '../../../../../../../../shared/utils/chrono'
import { DateInterval } from '../../../../../../../../shared/types/date-interval'
import { GetDaysForActivityDaysPeriodQry } from '../../../../application/get-days-for-activity-days-period-qry'
import { GetDaysForActivityNaturalDaysPeriodQry } from '../../../../application/get-days-for-activity-natural-days-period-qry'
import { Id } from '../../../../../../../../shared/types/id'

interface Props {
  roleId?: Id
  start: Date
  end: Date
  useDecimalTimeFormat: boolean
  timeUnit: TimeUnit
  maxAllowed?: number
  remaining?: number
}

export const DurationText: FC<Props> = (props) => {
  const { start, end, timeUnit, useDecimalTimeFormat, maxAllowed = 0, remaining = 0 } = props
  const { t } = useTranslation()
  const [numberOfDays, setNumberOfDays] = useState<null | number>(null)

  const { isLoading: daysLoading, executeUseCase: getDaysForActivityDaysPeriodQry } = useGetUseCase(
    GetDaysForActivityDaysPeriodQry
  )

  const { isLoading: naturalDaysLoading, executeUseCase: getDaysForActivityNaturalDaysPeriodQry } =
    useGetUseCase(GetDaysForActivityNaturalDaysPeriodQry)

  const formatTimePerTimeUnit = useCallback(
    (timeToFormat: number) => {
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
    const diffUnit = timeUnit === TimeUnits.MINUTES ? 'minute' : 'businessDay'
    const difference = chrono(start).diff(end, diffUnit)

    return timeUnit === TimeUnits.MINUTES
      ? getDurationByMinutes(difference, useDecimalTimeFormat)
      : getHumanizedDuration({
          duration: numberOfDays || 0,
          abbreviation: true,
          timeUnit
        })
  }, [timeUnit, end, start, useDecimalTimeFormat, numberOfDays])

  useEffect(() => {
    if (timeUnit === TimeUnits.MINUTES) return
    const dateInterval: DateInterval = { start, end }
    if (timeUnit === TimeUnits.DAYS) {
      getDaysForActivityDaysPeriodQry(dateInterval).then(setNumberOfDays)
    } else if (timeUnit === TimeUnits.NATURAL_DAYS && props.roleId !== undefined) {
      getDaysForActivityNaturalDaysPeriodQry({ roleId: props.roleId, interval: dateInterval }).then(
        setNumberOfDays
      )
    }
  }, [start, end, getDaysForActivityDaysPeriodQry])

  return (
    <>
      <Flex justify="space-between" w="100%" h="100%" mt="10px">
        <span>{t('activity_form.duration')}</span>
        {daysLoading || naturalDaysLoading ? (
          <span>{t('accessibility.loading')}</span>
        ) : (
          <span>{duration}</span>
        )}
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

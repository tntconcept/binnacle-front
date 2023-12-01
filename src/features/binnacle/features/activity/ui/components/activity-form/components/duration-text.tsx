import { Flex, Text } from '@chakra-ui/react'
import { getDurationByMinutes } from '../../../../utils/get-duration'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import { TimeUnits } from '../../../../../../../../shared/types/time-unit'
import { chrono, getHumanizedDuration } from '../../../../../../../../shared/utils/chrono'
import { DateInterval } from '../../../../../../../../shared/types/date-interval'
import { GetDaysForActivityDaysPeriodQry } from '../../../../application/get-days-for-activity-days-period-qry'
import { GetDaysForActivityNaturalDaysPeriodQry } from '../../../../application/get-days-for-activity-natural-days-period-qry'
import { Id } from '../../../../../../../../shared/types/id'
import { TimeInfo } from '../../../../../project-role/domain/project-role-time-info'

interface Props {
  // TODO: Remove once there is a dedicated TimeInfo API
  timeInfo: TimeInfo
  isRecentRole: boolean
  userId?: Id
  // TODO: Until here
  roleId?: Id
  start: Date
  end: Date
  useDecimalTimeFormat: boolean
}

export const DurationText: FC<Props> = (props) => {
  const { start, end, useDecimalTimeFormat } = props
  const { t } = useTranslation()
  const [numberOfDays, setNumberOfDays] = useState<null | number>(null)

  const { isLoading: daysLoading, executeUseCase: getDaysForActivityDaysPeriodQry } = useGetUseCase(
    GetDaysForActivityDaysPeriodQry
  )

  const { isLoading: naturalDaysLoading, executeUseCase: getDaysForActivityNaturalDaysPeriodQry } =
    useGetUseCase(GetDaysForActivityNaturalDaysPeriodQry)

  const formatTimePerTimeUnit = useCallback(
    (timeToFormat: number) => {
      return props.timeInfo.timeUnit === TimeUnits.MINUTES
        ? getDurationByMinutes(timeToFormat)
        : getHumanizedDuration({
            duration: timeToFormat,
            abbreviation: true,
            timeUnit: props.timeInfo.timeUnit
          })
    },
    [props.timeInfo.timeUnit]
  )

  const duration = useMemo(() => {
    const diffUnit = props.timeInfo.timeUnit === TimeUnits.MINUTES ? 'minute' : 'businessDay'
    const difference = chrono(start).diff(end, diffUnit)

    return props.timeInfo.timeUnit === TimeUnits.MINUTES
      ? getDurationByMinutes(difference, useDecimalTimeFormat)
      : getHumanizedDuration({
          duration: numberOfDays || 0,
          abbreviation: true,
          timeUnit: props.timeInfo.timeUnit
        })
  }, [props.timeInfo.timeUnit, end, start, useDecimalTimeFormat, numberOfDays])

  useEffect(() => {
    if (props.timeInfo.timeUnit === TimeUnits.MINUTES) {
      return
    }
    const dateInterval: DateInterval = { start, end }
    if (props.timeInfo.timeUnit === TimeUnits.DAYS) {
      getDaysForActivityDaysPeriodQry(dateInterval).then(setNumberOfDays)
    } else if (props.timeInfo.timeUnit === TimeUnits.NATURAL_DAYS && props.roleId !== undefined) {
      getDaysForActivityNaturalDaysPeriodQry({ roleId: props.roleId, interval: dateInterval }).then(
        setNumberOfDays
      )
    }
  }, [
    start,
    end,
    getDaysForActivityDaysPeriodQry,
    props.timeInfo.timeUnit,
    props.roleId,
    getDaysForActivityNaturalDaysPeriodQry
  ])

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

      <Flex
        w="100%"
        position="absolute"
        right="0"
        top="38px"
        alignItems="start"
        flexDirection="column"
      >
        {props.timeInfo.maxTimeAllowed.byYear > 0 && (
          <Text display="block" fontSize="xs" color="gray.500">
            {t('activity_form.remainingByYear', {
              remaining: formatTimePerTimeUnit(props.timeInfo.userRemainingTime),
              maxAllowed: formatTimePerTimeUnit(props.timeInfo.maxTimeAllowed.byYear)
            })}
          </Text>
        )}

        {props.timeInfo.maxTimeAllowed.byActivity > 0 && (
          <Text display="block" fontSize="xs" color="gray.500">
            {t('activity_form.remainingByActivity', {
              maxAllowed: formatTimePerTimeUnit(props.timeInfo.maxTimeAllowed.byActivity)
            })}
          </Text>
        )}
      </Flex>
    </>
  )
}

// @ts-ignore
import React, { ChangeEvent, unstable_useTransition as useTransition } from 'react'
import styles from 'features/TimeBalance/TimeStats/TimeStats.module.css'
import { getDuration } from 'utils/TimeUtils'
import { CustomNativeSelect } from 'common/components'
import { useSettings } from 'features/Settings/useSettings'
import { useTranslation } from 'react-i18next'
import DateTime from 'services/DateTime'
import { useBinnacleResources } from 'features/BinnacleResourcesProvider'
import Spinner from 'features/CalendarDesktop/CalendarControls/ArrowButton'
import { getTimeColor, getTimeDuration } from 'features/TimeBalance/utils'
import { SUSPENSE_CONFIG } from 'utils/constants'

const TimeStats: React.FC = () => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const { state } = useSettings()
  const {
    selectedMonth,
    timeBalanceMode,
    timeReader,
    fetchTimeResource
  } = useBinnacleResources()
  const timeData = timeReader()

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const optionSelected = event.target.value

    if (optionSelected === 'by_month') {
      startTransition(() => {
        fetchTimeResource('by_month')
      })
    } else {
      startTransition(() => {
        fetchTimeResource('by_year')
      })
    }
  }

  const showTimeDifference =
    DateTime.isThisMonth(selectedMonth) ||
    DateTime.isBefore(selectedMonth, DateTime.now())

  const timeDifferenceStyle: any = {
    visibility: showTimeDifference ? 'visible' : 'hidden'
  }

  return (
    <fieldset className={styles.container}>
      <legend className={styles.title}>{t('time_tracking.description')}</legend>
      <div className={styles.stats}>
        <div className={styles.timeBlock}>
          {t('time_tracking.imputed_hours')}
          <p
            data-testid="time_worked_value"
            className={styles.time}>
            {getDuration(timeData.timeWorked, state.useDecimalTimeFormat)}
          </p>
        </div>
        <div className={styles.divider} />
        <div className={styles.timeBlock}>
          {timeBalanceMode === 'by_year'
            ? DateTime.format(selectedMonth, 'yyyy')
            : DateTime.format(selectedMonth, 'MMMM')}
          <p
            data-testid="time_to_work_value"
            className={styles.time}>
            {getDuration(timeData.timeToWork, state.useDecimalTimeFormat)}
          </p>
        </div>
        <div
          className={styles.divider}
          style={timeDifferenceStyle} />
        <div
          className={styles.timeBlock}
          style={timeDifferenceStyle}>
          <div className={styles.selectContainer}>
            <CustomNativeSelect
              onChange={handleSelect}
              value={timeBalanceMode}>
              <option
                data-testid="balance_by_month_button"
                value="by_month">
                {t('time_tracking.month_balance')}
              </option>
              <option
                data-testid="balance_by_year_button"
                value="by_year">
                {t('time_tracking.year_balance')}
              </option>
            </CustomNativeSelect>
            {isPending && <Spinner className={styles.spinner} />}
          </div>
          <p
            className={styles.time}
            style={{
              color: getTimeColor(timeData.timeDifference)
            }}
            data-testid="time_balance_value"
          >
            {getTimeDuration(timeData.timeDifference, state.useDecimalTimeFormat)}
          </p>
        </div>
      </div>
    </fieldset>
  )
}

export default TimeStats

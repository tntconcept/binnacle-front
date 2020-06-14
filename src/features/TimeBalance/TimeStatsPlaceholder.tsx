import React from 'react'
import styles from './TimeStatsPlaceholder.module.css'
import { cls } from 'utils/helpers'

const TimeStatsPlaceholder = () => {
  return (
    <div className={styles.time}>
      <div className={cls(styles.timeLegend, 'loading-placeholder')} />
      <div className={cls(styles.timeBlock, 'loading-placeholder')} />
      <div className={cls(styles.timeBlock, 'loading-placeholder')} />
      <div className={cls(styles.timeBalanceBlock, 'loading-placeholder')} />
    </div>
  )
}

export default TimeStatsPlaceholder

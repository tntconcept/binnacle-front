import React from 'react'
import styles from "./TimeStatsPlaceholder.module.css"
import {cls} from "utils/helpers"

const TimeStatsMobilePlaceholder = () => {
  return (
    <div className={styles.mobileTime}>
      <div className={cls(styles.timeBlock, 'loading-placeholder')} />
      <div className={cls(styles.timeBlock, 'loading-placeholder')} />
      <div className={cls(styles.timeBalanceBlock, 'loading-placeholder')} />
    </div>
  )
}

export default TimeStatsMobilePlaceholder
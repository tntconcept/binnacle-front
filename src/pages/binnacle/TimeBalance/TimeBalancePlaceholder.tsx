import React from 'react'
import styles from 'pages/binnacle/TimeBalance/TimeBalancePlaceholder.module.css'
import { cls } from 'utils/helpers'

const TimeBalancePlaceholder = () => {
  return (
    <div className={styles.time}>
      <div className={cls(styles.timeLegend, 'loading-placeholder')} />
      <div className={cls(styles.timeBlock, 'loading-placeholder')} />
      <div className={cls(styles.timeBlock, 'loading-placeholder')} />
      <div className={cls(styles.timeBalanceBlock, 'loading-placeholder')} />
    </div>
  )
}

export default TimeBalancePlaceholder

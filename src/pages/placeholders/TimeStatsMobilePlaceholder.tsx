import React from 'react'
import {cls} from "utils/helpers"
import styles from "pages/placeholders/Placeholders.module.css"

const TimeStatsMobilePlaceholder = () => {
  return (
    <div className={styles.mobileTime}>
      <div className={cls(styles.timeBlock, styles.loading)} />
      <div className={cls(styles.timeBlock, styles.loading)} />
      <div className={cls(styles.timeBalanceBlock, styles.loading)} />
    </div>
  )
}

export default TimeStatsMobilePlaceholder
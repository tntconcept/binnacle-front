import React from 'react'
import styles from './Placeholders.module.css'
import {cls} from "utils/helpers"

const ActivitiesPlaceholder = () => {
  return (
    <div className={styles.activities}>
      <div>
        <div className={cls(styles.activitiesHoliday, styles.loading)} />
        <div className={cls(styles.activitiesTime, styles.loading)} />
      </div>
      {Array(2).fill(0).map((_, index) => (
        <div
          key={index}
          className={styles.activitiesCard}
        >
          <div className={cls(styles.activitiesCardHeader, styles.loading)} />
          <div className={cls(styles.activitiesCardDuration, styles.loading)} />
          <div className={cls(styles.activitiesCardDescription, styles.loading)} />
        </div>
      ))}
    </div>
  )
}

export default ActivitiesPlaceholder
import React from 'react'
import styles from 'pages/binnacle/BinnacleMobileLayout/ActivitiesListPlaceholder.module.css'
import { cls } from 'utils/helpers'

const ActivitiesListPlaceholder = () => {
  return (
    <div className={styles.activities}>
      <div>
        <div className={cls(styles.activitiesHoliday, 'loading-placeholder')} />
        <div className={cls(styles.activitiesTime, 'loading-placeholder')} />
      </div>
      {Array(2)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={styles.activitiesCard}>
            <div
              className={cls(styles.activitiesCardHeader, 'loading-placeholder')}
            />
            <div
              className={cls(styles.activitiesCardDuration, 'loading-placeholder')}
            />
            <div
              className={cls(
                styles.activitiesCardDescription,
                'loading-placeholder'
              )}
            />
          </div>
        ))}
    </div>
  )
}

export default ActivitiesListPlaceholder

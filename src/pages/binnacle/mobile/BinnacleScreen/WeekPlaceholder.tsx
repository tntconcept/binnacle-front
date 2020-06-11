import React from 'react'
import styles from './WeekPlaceholder.module.css'

const WeekPlaceholder = () => {
  return (
    <div className={styles.week}>
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={styles.weekday} />
        ))}
    </div>
  )
}

export default WeekPlaceholder

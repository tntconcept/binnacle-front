import React from "react"
import styles from 'pages/placeholders/Placeholders.module.css'
import {cls} from "utils/helpers"

const TimeStatsDesktopPlaceholder = () => {
  return (
    <div className={styles.time}>
      <div className={cls(styles.timeLegend, styles.loading)} />
      <div className={cls(styles.timeBlock, styles.loading)} />
      <div className={cls(styles.timeBlock, styles.loading)} />
      <div className={cls(styles.timeBalanceBlock, styles.loading)} />
    </div>
  );
};

export default TimeStatsDesktopPlaceholder;

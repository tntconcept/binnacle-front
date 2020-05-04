import React from "react"
import styles from './Placeholders.module.css'
import {cls} from "utils/helpers"

const TimeStatsPlaceholder = () => {
  return (
    <div className={styles.time}>
      <div className={cls(styles.timeLegend, styles.loading)} />
      <div className={cls(styles.timeBlock, styles.loading)} />
      <div className={cls(styles.timeBlock, styles.loading)} />
      <div className={cls(styles.timeBalanceBlock, styles.loading)} />
    </div>
  );
};

export default TimeStatsPlaceholder;

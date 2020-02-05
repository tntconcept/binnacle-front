import React from "react"
import styles from './TimeStats.module.css'

interface ITimeStats {
  timeBalance: any;
}

export const TimeStats: React.FC<ITimeStats> = React.memo(props => {
  console.count("Time Stats");
  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <span className={styles.description}>Imputadas</span>
        <span className={styles.value}>10h</span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <span className={styles.description}>Laborables</span>
        <span className={styles.value}>120h</span>
      </div>
      <div className={styles.separator} />
      <div className={styles.block}>
        <select
          style={{
            textTransform: "uppercase",
            fontSize: "8px",
            fontFamily: "Nunito sans"
          }}
        >
          <option data-testid="balance_by_month_button">
            balance mensual
          </option>
          <option data-testid="balance_by_year_button">balance anual</option>
        </select>
        <span className={styles.value}>10h</span>
      </div>
    </div>
  );
});

import React from 'react'
import styles from 'pages/binnacle/BinnacleDesktopLayout/CalendarCell.module.css'

const CalendarCell: React.FC = (props) => {
  return <div className={styles.base}>{props.children}</div>
}

export default CalendarCell

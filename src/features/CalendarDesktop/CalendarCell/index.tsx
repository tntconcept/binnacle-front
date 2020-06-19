import React from 'react'
import styles from 'features/CalendarDesktop/CalendarCell/CalendarCell.module.css'

const Cell: React.FC = (props) => {
  return <div className={styles.base}>{props.children}</div>
}

export default Cell

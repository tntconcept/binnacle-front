import React from 'react'
import styles from './CustomNativeSelect.module.css'

const CustomSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  style,
  ...props
}) => {
  return (
    <div
      className={styles.base}
      style={style}>
      <select
        className={styles.select}
        data-testid="select"
        {...props}>
        {props.children}
      </select>
      <span className={styles.arrow} />
    </div>
  )
}

export default CustomSelect

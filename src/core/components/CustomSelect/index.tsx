import React from 'react'
import styles from "./CustomSelect.module.css"


const CustomSelect: React.FC<React.SelectHTMLAttributes<any>> = ({style,...props}) => {
  return (
    <div className={styles.base} style={style}>
      <select
        className={styles.select}
        {...props}
      >
        {props.children}
      </select>
      <span className={styles.arrow} />
    </div>

  )
}

export default CustomSelect
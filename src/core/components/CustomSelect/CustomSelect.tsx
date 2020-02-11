import React from 'react'
import styles from "./CustomSelect.module.css"


const CustomSelect: React.FC<React.SelectHTMLAttributes<any>> = props => {
  return (
    <select className={styles.select} {...props}>
      {props.children}
    </select>
  )
}

export default CustomSelect
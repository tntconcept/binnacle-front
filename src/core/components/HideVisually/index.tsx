import React from 'react'
import styles from './HideVisually.module.css'

const HideVisually: React.FC<any> = (props) => {
  return (
    <span className={styles.hideVisually} {...props}>
      {props.children}
    </span>
  )
}

export default HideVisually
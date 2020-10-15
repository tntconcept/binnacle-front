import React from 'react'
import styles from 'core/components/ButtonVisuallyHidden.module.css'

const ButtonVisuallyHidden: React.FC<any> = (props) => {
  return (
    <button className={styles.visuallyHidden} {...props}>
      {props.children}
    </button>
  )
}

export default ButtonVisuallyHidden

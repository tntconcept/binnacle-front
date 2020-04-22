import React from 'react'
import styles from 'core/components/VisuallyHidden/VisuallyHidden.module.css'

const VisuallyHidden: React.FC<any> = (props) => {
  return (
    <span className={styles.visuallyHidden} {...props}>
      {props.children}
    </span>
  )
}

export default VisuallyHidden
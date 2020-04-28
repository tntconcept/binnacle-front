import React from 'react'
import styles from 'core/components/VisuallyHidden/VisuallyHidden.module.css'

const VisuallyHidden: React.FC<any> = (props) => {
  const Tag = props.tag || 'span';
  return (
    <Tag className={styles.visuallyHidden} {...props}>
      {props.children}
    </Tag>
  )
}

export default VisuallyHidden
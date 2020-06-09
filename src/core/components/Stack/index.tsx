import React from 'react'
import styles from 'core/components/Stack/Stack.module.css'

const Stack: React.FC = ({children, ...props}) => {
  return (
    <div className={styles.stack} {...props}>
      {children}
    </div>
  )
}

export default Stack

import React from 'react'
import styles from 'core/components/Stack.module.css'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Stack: React.FC<Props> = ({ children, ...props }) => {
  return (
    <div
      className={styles.stack}
      {...props}>
      {children}
    </div>
  )
}

export default Stack

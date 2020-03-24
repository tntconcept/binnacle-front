import React from 'react'
import styles from './Stack.module.css'

// TODO Sacar de aquí este componente
const Stack: React.FC = (props) => {
  return (
    <div className={styles.stack}>
      {props.children}
    </div>
  )
}

export default Stack

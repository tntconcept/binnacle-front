import React from 'react'
import styles from './Radio.module.css'

interface IRadio extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Radio({ children, ...props }: IRadio) {
  const id = children + '_checkbox'

  return (
    <label
      htmlFor={id}
      className={styles.label}>
      <input
        type="radio"
        id={id}
        name={props.name}
        data-testid={id}
        {...props} />
      <span>{children}</span>
    </label>
  )
}

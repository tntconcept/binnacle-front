import React from 'react'
import styles from './Checkbox.module.css'
import { cls } from 'utils/helpers'

interface ICheckbox extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  wrapperClassName?: string
}

const Checkbox: React.FC<ICheckbox> = ({ label, wrapperClassName, ...props }) => {
  const id = props.name + '_checkbox'

  return (
    <div className={cls(styles.base, wrapperClassName && wrapperClassName)}>
      <input
        className={styles.checkbox}
        id={id}
        type="checkbox"
        {...props}
        data-testid={id}
      />
      <label
        className={styles.label}
        htmlFor={id}>
        <span>
          <svg
            width="12px"
            height="10px">
            <use xlinkHref="#check" />
          </svg>
        </span>
        <span>{label}</span>
      </label>
      <svg className={styles.inlineSvg}>
        <symbol
          id="check"
          viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  )
}

export default Checkbox

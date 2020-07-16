import React from 'react'
import styles from './Button.module.css'
import { cls } from 'utils/helpers'
import { Spinner } from 'common/components'

interface ButtonStyle {
  isFullWidth?: boolean
  isTransparent?: boolean
  isCircular?: boolean
  isLoading?: boolean
  className?: string
}

interface ButtonProps extends ButtonStyle {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  type,
  onClick,
  isFullWidth,
  children,
  isTransparent,
  isCircular,
  isLoading = false,
  className,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent) => {
    onClick && onClick()
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      className={cls(
        styles.button,
        isFullWidth && styles.isFullWidth,
        isTransparent && styles.isTransparent,
        isCircular && styles.isCircular,
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {children}
      {isLoading && !isCircular && <Spinner style={{ marginLeft: '10px' }} />}
    </button>
  )
}

export default Button

Button.defaultProps = {
  isFullWidth: false
}

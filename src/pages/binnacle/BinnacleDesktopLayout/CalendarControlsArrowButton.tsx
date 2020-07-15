// @ts-ignore
import React, { unstable_useTransition as useTransition } from 'react'
import { SUSPENSE_CONFIG } from 'utils/constants'
import styles from 'pages/binnacle/BinnacleDesktopLayout/CalendarControls.module.css'
import { cls } from 'utils/helpers'

export const CalendarControlsArrowButton: React.FC<React.ButtonHTMLAttributes<
  HTMLButtonElement
>> = ({ onClick, children, ...props }) => {
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)

  const handleClick = () => {
    if (!isPending) {
      startTransition(onClick)
    }
  }

  return (
    <button
      className={styles.arrowButton}
      onClick={handleClick}
      {...props}>
      {isPending && <Spinner />}
      {children}
    </button>
  )
}

const Spinner: React.FC<any> = ({ className, ...props }) => {
  return (
    <div
      className={cls('spinner', styles.spinner, className)}
      data-testid="spinner"
      {...props}
    />
  )
}

export default Spinner

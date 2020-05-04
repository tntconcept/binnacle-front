// @ts-ignore
import React, {useTransition} from "react"
import {suspenseConfig} from "utils/config"
import styles from "pages/binnacle/desktop/CalendarControls/CalendarControls.module.css"
import Spinner from "core/components/Spinner"

export const ArrowButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  onClick,
  children,
  ...props
}) => {
  const [startTransition, isPending] = useTransition(suspenseConfig)

  const handleClick = () => startTransition(onClick)

  return (
    <button
      className={styles.arrowButton}
      onClick={handleClick}
      {...props}
      disabled={isPending}
    >
      {isPending && <Spinner className={styles.spinner} />}
      {children}
    </button>
  )
}
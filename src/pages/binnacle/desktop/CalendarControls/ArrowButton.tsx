// @ts-ignore
import React, {useTransition} from "react"
import {suspenseConfig} from "utils/config"
import styles from "pages/binnacle/desktop/CalendarControls/CalendarControls.module.css"
import {cls} from "utils/helpers"

export const ArrowButton: React.FC<React.ButtonHTMLAttributes<
  HTMLButtonElement
>> = ({ onClick, children, ...props }) => {
  const [startTransition, isPending] = useTransition(suspenseConfig);

  const handleClick = () => {
    if (!isPending) {
      startTransition(onClick);
    }
  }

  return (
    <button
      className={styles.arrowButton}
      onClick={handleClick}
      {...props}
    >
      {isPending && <Spinner />}
      {children}
    </button>
  );
};

const Spinner: React.FC<any> = ({ className, ...props }) => {
  return (
    <div
      className={cls("spinner", styles.spinner, className)}
      data-testid="spinner"
      {...props}
    />
  );
};

export default Spinner;

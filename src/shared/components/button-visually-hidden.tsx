import type { ComponentPropsWithoutRef, FC } from 'react'
import styles from 'shared/components/button-visually-hidden.module.css'

export const ButtonVisuallyHidden: FC<ComponentPropsWithoutRef<'button'>> = (props) => {
  return (
    <button className={styles.visuallyHidden} {...props}>
      {props.children}
    </button>
  )
}

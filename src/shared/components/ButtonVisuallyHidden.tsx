import type { FC } from 'react'
import styles from 'shared/components/ButtonVisuallyHidden.module.css'

const ButtonVisuallyHidden: FC<any> = (props) => {
  return (
    <button className={styles.visuallyHidden} {...props}>
      {props.children}
    </button>
  )
}

export default ButtonVisuallyHidden

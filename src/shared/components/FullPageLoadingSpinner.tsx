import { ReactComponent as N_LETTER } from 'assets/logo_n_letter.svg'
import type { FC } from 'react'
import styles from './FullPageLoadingSpinner.module.css'

export const TntSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <N_LETTER />
    </div>
  )
}

const FullPageLoadingSpinner: FC = () => {
  return <TntSpinner />
}

export default FullPageLoadingSpinner

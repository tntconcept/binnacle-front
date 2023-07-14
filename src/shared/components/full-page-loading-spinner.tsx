import { ReactComponent as N_LETTER } from '../../assets/logo_n_letter.svg'
import type { FC } from 'react'
import styles from './full-page-loading-spinner.module.css'

export const TntSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <N_LETTER />
    </div>
  )
}

export const FullPageLoadingSpinner: FC = () => {
  return <TntSpinner />
}

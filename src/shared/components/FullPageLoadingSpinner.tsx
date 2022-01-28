import { ReactComponent as N_LETTER } from 'assets/logo_n_letter.svg'
import type { FC } from 'react'
import styles from 'shared/components/FullPageLoadingSpinner.module.css'

export const AutentiaSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <N_LETTER />
    </div>
  )
}

const FullPageLoadingSpinner: FC = () => {
  return <AutentiaSpinner />
}

export default FullPageLoadingSpinner

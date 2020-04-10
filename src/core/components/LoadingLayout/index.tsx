import React from "react"
import styles from 'core/components/LoadingLayout/LoadingLayout.module.css'
import useDelayLoading from "core/hooks/useDelayLoading"
import {ReactComponent as N_Letter} from './logo_n_letter.svg'

const AutentiaSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <N_Letter />
    </div>
  )
}

const LoadingLayout: React.FC = () => {
  const showLoading = useDelayLoading(250);
  return showLoading ? <AutentiaSpinner /> : null
};

export default LoadingLayout

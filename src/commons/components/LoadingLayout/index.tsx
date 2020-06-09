import React from "react"
import styles from "commons/components/LoadingLayout/LoadingLayout.module.css"
import {ReactComponent as N_LETTER} from "assets/icons/logo_n_letter.svg"

export const AutentiaSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <N_LETTER />
    </div>
  );
};

const LoadingLayout: React.FC = () => {
  return <AutentiaSpinner />
};

export default LoadingLayout;

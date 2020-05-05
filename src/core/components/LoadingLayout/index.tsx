import React from "react"
import styles from "core/components/LoadingLayout/LoadingLayout.module.css"
import useDelayLoading from "core/hooks/useDelayLoading"
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
  const showLoading = useDelayLoading(250);
  return showLoading ? <AutentiaSpinner /> : null;
};

export default LoadingLayout;

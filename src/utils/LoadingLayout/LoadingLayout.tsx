import React from "react"
import styles from './LoadingLayout.module.css'
import loading from 'assets/loader.gif'
import useDelayLoading from "core/hooks/useDelayLoading"

const LoadingLayout: React.FC = () => {
  const showLoading = useDelayLoading(300);

  return showLoading ? (
    <div
      className={styles.loader}
    >
      <div className={styles.inner}>
        <div
          className={styles.text}
          style={{
            backgroundImage: `-webkit-linear-gradient(transparent, transparent), url(${loading})`
          }}
        >
          Loading
        </div>
      </div>
    </div>
  ) : null
};

export default LoadingLayout
import React from "react"
import styles from "./ErrorModal.module.css"
import {ReactComponent as CloseIcon} from "assets/icons/close.svg"
import getErrorMessage from "utils/FetchErrorHandling"
import ReactDOM from "react-dom"

interface IErrorModal {
  error: Error;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ErrorModal: React.FC<IErrorModal> = props => {
  const message = getErrorMessage(props.error as any);

  return ReactDOM.createPortal(
    <aside
      className={styles.overlay}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <div className={styles.modal}>
        <header className={styles.header}>
          <span className={styles.icon}>
            <CloseIcon style={{ width: 10, height: 20 }} />
          </span>
          <span className={styles.title}>{message.title}</span>
        </header>
        <p className={styles.subtitle}>{message.description}</p>
        <footer className={styles.footer}>
          <button>cancel</button>
          <button>ok</button>
        </footer>
      </div>
    </aside>,
    document.body
  );
};

export default ErrorModal;

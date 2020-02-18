import React from "react"
import styles from "./ErrorModal.module.css"
import {ReactComponent as CloseIcon} from "assets/icons/close.svg"
import ReactDOM from "react-dom"
import Button from "core/components/Button"

interface IMessage {
  title: string,
  description: string
}

interface IErrorModal {
  message: IMessage;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ErrorModal: React.FC<IErrorModal> = props => {
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
          <span className={styles.title}>{props.message.title}</span>
        </header>
        <p className={styles.subtitle}>{props.message.description}</p>
        <footer className={styles.footer}>
          <Button isTransparent onClick={props.onCancel} data-testid="no_modal_button">{props.cancelText}</Button>
          <Button onClick={props.onConfirm} data-testid="yes_modal_button">{props.confirmText}</Button>
        </footer>
      </div>
    </aside>,
    document.body
  );
};

export default ErrorModal;

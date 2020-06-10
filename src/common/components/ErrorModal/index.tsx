import React from 'react'
import styles from './ErrorModal.module.css'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import ReactDOM from 'react-dom'
import { classNames, FocusOn } from 'react-focus-on'
import { Button } from 'common/components'
import { useTranslation } from 'react-i18next'

interface IMessage {
  title: string;
  description: string;
}

interface IErrorModal {
  message: IMessage;
  confirmText: string;
  onConfirm: () => void;
  confirmIsLoading: boolean;
  onClose: () => void;
}

const ErrorModal: React.FC<IErrorModal> = props => {
  const {t} = useTranslation()

  return ReactDOM.createPortal(
    <aside
      className={styles.overlay}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <FocusOn
        onClickOutside={props.onClose}
        onEscapeKey={props.onClose}
        className={classNames.fullWidth}
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
            <Button
              isTransparent
              onClick={props.onClose}
              data-testid="no_modal_button"
            >
              {t("actions.cancel")}
            </Button>
            <Button
              onClick={props.onConfirm}
              data-testid="yes_modal_button"
              isLoading={props.confirmIsLoading}
            >
              {props.confirmText}
            </Button>
          </footer>
        </div>
      </FocusOn>
    </aside>,
    document.body
  );
};

export default ErrorModal;

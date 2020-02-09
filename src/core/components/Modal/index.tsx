import React from "react"
import ReactDOM from "react-dom"
import {classNames, FocusOn} from "react-focus-on"
import styles from "./Modal.module.css"
import Button from "core/components/Button"

interface IModal {
  ariaLabel: string;
  onClose: () => void;
}

const Modal: React.FC<IModal> = props => {
  return ReactDOM.createPortal(
    <aside
      className={styles.overlay}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
      aria-label={props.ariaLabel}
    >
      <FocusOn
        onClickOutside={props.onClose}
        onEscapeKey={props.onClose}
        className={classNames.fullWidth}
      >
        <div className={styles.modal}>
          <button
            className="c-modal__close"
            aria-labelledby="close-modal"
            onClick={props.onClose}
          >
            <span id="close-modal" className={styles.hideVisually}>
              Close
            </span>
            <svg className={styles.icon} viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
            </svg>
          </button>
          <div className="c-modal__body">{props.children}</div>
        </div>
      </FocusOn>
    </aside>,
    document.body
  );
};

const Modal2: React.FC<any> = (props) => {
  return ReactDOM.createPortal(
    <aside
      className={styles.overlay}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <div className={styles.modal}>
        <header className={styles.header}>
          <span>{props.header}</span>
          <Button aria-labelledby="close-modal" onClick={props.onClose}>
            <span id="close-modal" className={styles.hideVisually}>
              Close
            </span>
            <svg className={styles.icon} viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
            </svg>
          </Button>
        </header>
        <div className={styles.content}>
          {props.children}
        </div>
      </div>
    </aside>,
    document.body
  );
};

export default Modal2;

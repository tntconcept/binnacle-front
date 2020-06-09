import React from "react"
import ReactDOM from "react-dom"
import {classNames, FocusOn} from "react-focus-on"
import styles from "./Modal.module.css"
import Button from "commons/components/Button"
import HideVisually from "commons/components/VisuallyHidden"
import {useTranslation} from "react-i18next"

interface IModal {
  onClose: () => void;
  header?: JSX.Element
}

const Modal: React.FC<IModal> = props => {
  const {t} = useTranslation()

  return ReactDOM.createPortal(
    <aside
      className={styles.overlay}
      aria-modal="true"
      role="dialog"
      aria-describedby="modal_title"
    >
      <FocusOn
        onClickOutside={props.onClose}
        onEscapeKey={props.onClose}
        className={classNames.fullWidth}
      >
        <div
          className={styles.modal}
          data-testid="modal"
        >
          <header className={styles.header}>
            {props.header}
            <Button
              isTransparent
              aria-labelledby="close-modal"
              onClick={props.onClose}
            >
              <HideVisually id="close-modal">{t("actions.close")}</HideVisually>
              <svg className={styles.icon} viewBox="0 0 40 40">
                <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
              </svg>
            </Button>
          </header>
          <div className={styles.content}>{props.children}</div>
        </div>
      </FocusOn>
    </aside>,
    document.body
  );
};

export default Modal;

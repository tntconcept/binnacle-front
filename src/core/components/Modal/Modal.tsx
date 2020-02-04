import React from "react"
import ReactDOM from "react-dom"
import {cover, hideVisually, icon, modal} from "core/components/Modal/Modal.styles"
import {FocusOn} from "react-focus-on"

interface IModal {
  ariaLabel: string;
  onClose: () => void;
}

const Modal: React.FC<IModal> = props => {
  return ReactDOM.createPortal(
    <aside
      className={cover}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
      aria-label={props.ariaLabel}
    >
      <FocusOn
        onClickOutside={props.onClose}
        onEscapeKey={props.onClose}
      >
        <div className={modal}>
          <button
            className="c-modal__close"
            aria-labelledby="close-modal"
            onClick={props.onClose}
          >
            <span id="close-modal" className={hideVisually}>
              Close
            </span>
            <svg className={icon} viewBox="0 0 40 40">
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

export default Modal;

import React, {memo} from "react"
import {css} from "linaria"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import useModal from "core/hooks/useModal"
import Modal from "core/components/Modal/Modal"

const button = css`
  width: 100px;
  height: 40px;
  border-radius: 5px;
  background-color: #10069f;
  color: white;
  font-family: "Work sans", "serif";
  font-size: 12px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: none;
`;

const buttonT = css`
  width: 100px;
  height: 40px;
  background-color: transparent;
  color: black;
  font-family: "Work sans", "serif";
  font-size: 12px;
  border: none;
`

interface IActivityFormFooter {
  onRemove: () => void
  onSave: () => void
}

const ActivityFormFooter: React.FC<IActivityFormFooter> = memo((props) => {
  const {modalIsOpen, toggleIsOpen} = useModal()

  return (
    <div className={styles.footer}>
      {
        modalIsOpen && (
          <Modal
            ariaLabel="asd"
            onClose={toggleIsOpen}
          >
            <button>Hello baby</button>
          </Modal>
        )
      }
      <button
        className={buttonT}
        onClick={toggleIsOpen}
      >
        Eliminar
      </button>
      <button
        className={button}
        data-testid="save_activity"
        type="submit"
        onClick={props.onSave}
      >
        Save activity
      </button>
    </div>
  )
})

export default ActivityFormFooter
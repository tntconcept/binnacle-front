import React, {memo} from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import useModal from "core/hooks/useModal"
import Modal from "core/components/Modal"

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
            <button data-testid="yes_modal_button" onClick={() => console.log("hello baby")}>Remove</button>
            <button data-testid="no_modal_button" onClick={toggleIsOpen}>Cancel</button>
          </Modal>
        )
      }
      <button
        onClick={toggleIsOpen}
        type={"button"}
      >
        Eliminar
      </button>
      <button
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
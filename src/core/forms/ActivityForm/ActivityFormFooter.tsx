import React, {memo} from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import useModal from "core/hooks/useModal"
import Modal from "core/components/Modal"
import {useTranslation} from "react-i18next"
import {deleteActivity} from "services/activitiesService"
import {useHistory} from "react-router-dom"

interface IActivityFormFooter {
  id: number | undefined;
  onRemove: () => void;
  onSave: () => void;
}

const ActivityFormFooter: React.FC<IActivityFormFooter> = memo(props => {
  const { t } = useTranslation();
  let history = useHistory();
  const { modalIsOpen, toggleIsOpen } = useModal();

  const handleDeleteActivity = async () => {
    await deleteActivity(props.id!);
    history.push("/binnacle")
  };

  return (
    <div className={styles.footer}>
      {modalIsOpen && (
        <Modal
          ariaLabel="Are you sure that you want to delete the activity?"
          onClose={toggleIsOpen}
        >
          <button data-testid="yes_modal_button" onClick={handleDeleteActivity}>
            Remove
          </button>
          <button data-testid="no_modal_button" onClick={toggleIsOpen}>
            Cancel
          </button>
        </Modal>
      )}
      {props.id && (
        <button onClick={toggleIsOpen} type={"button"}>
          {t("actions.remove")}
        </button>
      )}
      <button data-testid="save_activity" type="submit" onClick={props.onSave}>
        {t("actions.save")}
      </button>
    </div>
  );
});

export default ActivityFormFooter;

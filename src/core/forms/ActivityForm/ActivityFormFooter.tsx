import React, {memo} from "react"
import useModal from "core/hooks/useModal"
import Modal from "core/components/Modal"
import {useTranslation} from "react-i18next"
import {deleteActivity} from "services/activitiesService"
import Button from "core/components/Button"
import styles from "./ActivityForm.module.css"

interface IActivityFormFooter {
  id: number | undefined;
  onRemove: () => void;
  onSave: any;
}

const ActivityFormFooter: React.FC<IActivityFormFooter> = memo(props => {
  const { t } = useTranslation();
  const { modalIsOpen, toggleModal } = useModal();

  const handleDeleteActivity = async () => {
    await deleteActivity(props.id!);
    props.onRemove()
  };

  return (
    <div className={styles.footer} style={{
      justifyContent: props.id ? "space-between" : "flex-end"
    }}>
      {modalIsOpen && (
        <Modal
          ariaLabel="Are you sure that you want to delete the activity?"
          onClose={toggleModal}
        >
          <Button data-testid="no_modal_button" onClick={toggleModal}>
            Cancel
          </Button>
          <Button isTransparent data-testid="yes_modal_button" onClick={handleDeleteActivity}>
            Remove
          </Button>
        </Modal>
      )}
      {props.id && (
        <Button isTransparent onClick={toggleModal} type={"button"}>
          {t("actions.remove")}
        </Button>
      )}
      <Button data-testid="save_activity" type="submit" onClick={props.onSave}>
        {t("actions.save")}
      </Button>
    </div>
  );
});

export default ActivityFormFooter;

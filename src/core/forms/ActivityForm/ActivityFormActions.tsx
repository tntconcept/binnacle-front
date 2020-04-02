import React, {memo} from "react"
import useModal from "core/hooks/useModal"
import {useTranslation} from "react-i18next"
import Button from "core/components/Button"
import styles from "./ActivityForm.module.css"
import {IActivity} from "api/interfaces/IActivity"
import ErrorModal from "core/components/ErrorModal"

interface IActivityFormActions {
  activity: IActivity | undefined;
  onRemove: () => Promise<void>;
  onSave: () => void;
}

const ActivityFormActions: React.FC<IActivityFormActions> = memo(props => {
  const { t } = useTranslation();
  const { modalIsOpen, toggleModal, setIsOpen } = useModal();

  const handleDeleteActivity = async () => {
    await props.onRemove();
    setIsOpen(false);
  };

  return (
    <div
      className={styles.footer}
      style={{
        justifyContent: props.activity ? "space-between" : "flex-end"
      }}
    >
      {modalIsOpen && (
        <ErrorModal
          message={{
            title: t("remove_modal.title"),
            description: t("remove_modal.description")
          }}
          onClose={() => setIsOpen(false)}
          onConfirm={handleDeleteActivity}
          confirmText={t("actions.remove")}
        />
      )}
      {props.activity && (
        <Button
          data-testid="remove_activity"
          isTransparent
          onClick={toggleModal}
          type={"button"}
        >
          {t("actions.remove")}
        </Button>
      )}
      <Button data-testid="save_activity" type="button" onClick={props.onSave}>
        {t("actions.save")}
      </Button>
    </div>
  );
});

export default ActivityFormActions;

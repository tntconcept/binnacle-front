import React, {memo, useContext} from "react"
import useModal from "core/hooks/useModal"
import {useTranslation} from "react-i18next"
import {deleteActivity} from "services/ActivitiesAPI"
import Button from "core/components/Button"
import styles from "./ActivityForm.module.css"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {BinnacleActions} from "core/contexts/BinnacleContext/binnacleActions"
import {IActivity} from "interfaces/IActivity"
import ErrorModal from "core/components/ErrorModal/ErrorModal"

interface IActivityFormFooter {
  activity: IActivity | undefined;
  onRemove: () => void;
  onSave: any;
}

const ActivityFormFooter: React.FC<IActivityFormFooter> = memo(props => {
  const { t } = useTranslation();
  const { dispatch } = useContext(BinnacleDataContext);
  const { modalIsOpen, toggleModal } = useModal();

  const handleDeleteActivity = async () => {
    try {
      await deleteActivity(props.activity!.id);
      dispatch(BinnacleActions.deleteActivity(props.activity!));
      props.onRemove();
    } catch (e) {
      console.log(e);
    }
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
          onCancel={toggleModal}
          onConfirm={handleDeleteActivity}
          cancelText={t("actions.cancel")}
          confirmText={t("actions.remove")}
        />
      )}
      {props.activity && (
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

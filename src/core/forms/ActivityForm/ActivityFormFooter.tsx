import React, {memo, useContext} from "react"
import useModal from "core/hooks/useModal"
import {useTranslation} from "react-i18next"
import {deleteActivity} from "api/ActivitiesAPI"
import Button from "core/components/Button"
import styles from "./ActivityForm.module.css"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {BinnacleActions} from "core/contexts/BinnacleContext/BinnacleActions"
import {IActivity} from "api/interfaces/IActivity"
import ErrorModal from "core/components/ErrorModal"

interface IActivityFormFooter {
  activity: IActivity | undefined;
  onRemove: () => void;
}

const ActivityFormFooter: React.FC<IActivityFormFooter> = memo(props => {
  const { t } = useTranslation();
  const { dispatch } = useContext(BinnacleDataContext);
  const { modalIsOpen, toggleModal, setIsOpen } = useModal();

  const handleDeleteActivity = async () => {
    try {
      await deleteActivity(props.activity!.id);
      dispatch(BinnacleActions.deleteActivity(props.activity!));
      setIsOpen(false)
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
          onCancel={() => setIsOpen(false)}
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
      <Button
        data-testid="save_activity"
        type="submit"
      >
        {t("actions.save")}
      </Button>
    </div>
  );
});

export default ActivityFormFooter;

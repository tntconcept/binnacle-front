// @ts-ignore
import React, {useContext, useState, useTransition} from "react"
import useModal from "core/hooks/useModal"
import {useTranslation} from "react-i18next"
import Button from "core/components/Button"
import {IActivity} from "api/interfaces/IActivity"
import ErrorModal from "core/components/ErrorModal"
import {deleteActivity} from "api/ActivitiesAPI"
import getErrorMessage from "api/HttpClient/HttpErrorMapper"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import {useCalendarResources} from "pages/binnacle/desktop/CalendarResourcesContext"

interface IRemoveActivityButton {
  activity: IActivity;
  onDeleted: () => void;
}

const RemoveActivityButton: React.FC<IRemoveActivityButton> = props => {
  const { t } = useTranslation();
  const [startTransition, isPending] = useTransition({timeoutMs: 2000})
  const showNotification = useContext(NotificationsContext);
  const { updateCalendarResources } = useCalendarResources();

  const { modalIsOpen, toggleModal, setIsOpen } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteActivity = async () => {
    try {
      setIsDeleting(true);
      await deleteActivity(props.activity.id);
      startTransition(() => {
        setIsOpen(false);
        props.onDeleted();
        updateCalendarResources()
      })
    } catch (e) {
      setIsDeleting(false);
      showNotification(getErrorMessage(e));
    }
  };

  return (
    <React.Fragment>
      {modalIsOpen && (
        <ErrorModal
          message={{
            title: t("remove_modal.title"),
            description: t("remove_modal.description")
          }}
          onClose={() => setIsOpen(false)}
          onConfirm={handleDeleteActivity}
          confirmIsLoading={isDeleting || isPending}
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
    </React.Fragment>
  );
};

export default RemoveActivityButton;

// @ts-ignore
import React, {unstable_useTransition as useTransition, useState} from "react"
import {useTranslation} from "react-i18next"
import Button from "commons/components/Button"
import {IActivity} from "api/interfaces/IActivity"
import ErrorModal from "commons/components/ErrorModal"
import ActivitiesAPI from "api/ActivitiesAPI/ActivitiesAPI"
import getErrorMessage from "services/HttpClient/HttpErrorMapper"
import {useShowNotification} from "features/Notifications"
import {useBinnacleResources} from "features/BinnacleResourcesProvider"
import {SUSPENSE_CONFIG} from "utils/constants"

interface IRemoveActivityButton {
  activity: IActivity;
  onDeleted: () => void;
}

const RemoveActivityButton: React.FC<IRemoveActivityButton> = props => {
  const { t } = useTranslation();
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const showNotification = useShowNotification();
  const { updateCalendarResources } = useBinnacleResources();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteActivity = async () => {
    try {
      setIsDeleting(true);
      await ActivitiesAPI.delete(props.activity.id);
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
          onClick={() => setIsOpen(open => !open)}
          type="button"
        >
          {t("actions.remove")}
        </Button>
      )}
    </React.Fragment>
  );
};

export default RemoveActivityButton;

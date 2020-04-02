import React, {useContext, useState} from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import ImageFile from "core/components/ImageFile"
import Button from "core/components/Button"
import {useTranslation} from "react-i18next"
import {getActivityImage} from "api/ActivitiesAPI"
import {openImageInTab} from "core/forms/ActivityForm/utils"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import getErrorMessage from "api/HttpClient/HttpErrorMapper"

interface IUploadImage {
  activityId?: number;
  activityHasImg: boolean;
  imgBase64: string | null;
  handleChange: (imgBase64: string | null) => void;
}

const UploadImage: React.FC<IUploadImage> = props => {
  const { t } = useTranslation();
  const showNotification = useContext(NotificationsContext)

  const [showActions, setShowActions] = useState(() => {
    if (props.activityHasImg && props.imgBase64 === null) {
      return true
    } else {
      return props.imgBase64 !== null
    }
  })

  const openImage = async () => {
    if (props.imgBase64 === null) {
      try {
        const image = await getActivityImage(props.activityId!);
        props.handleChange(image);
        openImageInTab(image);
      } catch (e) {
        showNotification(getErrorMessage(e))
      }
    } else {
      openImageInTab(props.imgBase64);
    }
  };

  const uploadImage = (value: string | null) => {
    props.handleChange(value)
    setShowActions(true)
  }

  const removeImage = () => {
    props.handleChange(null)
    setShowActions(false)
  }

  return (
    <div className={styles.image}>
      <span>{t("activity_form.image")}</span>
      <div>
        <ImageFile
          label="Upload image"
          value={props.imgBase64}
          onChange={uploadImage}
        />
        {showActions && (
          <Button type="button" data-testid="open-image" onClick={openImage}>
            Ver
          </Button>
        )}
        {showActions && (
          <Button
            type="button"
            data-testid="delete-image"
            onClick={removeImage}
          >
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadImage;

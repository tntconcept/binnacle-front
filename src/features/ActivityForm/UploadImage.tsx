import React, {useContext, useState} from "react"
import styles from "features/ActivityForm/ActivityForm.module.css"
import ImageFile from "features/ActivityForm/ImageFile"
import Button from "core/components/Button"
import {useTranslation} from "react-i18next"
import {getActivityImage} from "api/ActivitiesAPI"
import {openImageInTab} from "features/ActivityForm/utils"
import {NotificationsContext} from "features/Notifications"
import getErrorMessage from "services/HttpClient/HttpErrorMapper"
import {ReactComponent as ThrashIcon} from "assets/icons/thrash.svg"
import {ReactComponent as ExternalLinkIcon} from "assets/icons/external-link.svg"
import Spinner from "core/components/Spinner"

interface IUploadImage {
  activityId?: number;
  activityHasImg: boolean;
  imgBase64: string | null;
  handleChange: (imgBase64: string | null) => void;
}

const UploadImage: React.FC<IUploadImage> = props => {
  const { t } = useTranslation();
  const showNotification = useContext(NotificationsContext)
  const [isFetchingImg, setIsFetchingImg] = useState(false)

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
        setIsFetchingImg(true)
        const image = await getActivityImage(props.activityId!);
        props.handleChange(image);
        setIsFetchingImg(false)
        openImageInTab(image);
      } catch (e) {
        setIsFetchingImg(false)
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
      <span style={{marginRight: "10px"}}>{t("activity_form.image")}</span>
      <div className={styles.imageActions}>
        <ImageFile
          label={t("activity_form.image_upload")}
          value={props.imgBase64}
          onChange={uploadImage}
        />
        {showActions && (
          <Button
            type="button"
            data-testid="open-image"
            onClick={openImage}
            isLoading={isFetchingImg}
            isCircular={true}
            isTransparent={true}
            aria-label={t("activity_form.image_open_button")}
          >
            <ExternalLinkIcon style={{width: "20px"}} />
          </Button>
        )}
        {showActions && (
          <Button
            type="button"
            data-testid="delete-image"
            onClick={removeImage}
            isCircular={true}
            isTransparent={true}
            aria-label={t("activity_form.image_delete_button")}
          >
            <ThrashIcon style={{width: "20px"}} />
          </Button>
        )}
        {isFetchingImg && <Spinner />}
      </div>
    </div>
  );
};

export default UploadImage;

import React from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import ImageFile from "core/components/ImageFile"
import Button from "core/components/Button"
import {useTranslation} from "react-i18next"
import {getActivityImage} from "api/ActivitiesAPI"
import {openImageInTab} from "core/forms/ActivityForm/utils"

interface IUploadImage {
  activityId?: number;
  hasImage: boolean;
  imgBase64: string | null;
  handleChange: (imgBase64: string | null) => void;
  toggleErrorModal: () => void;
}

const UploadImage: React.FC<IUploadImage> = props => {
  const { t } = useTranslation();

  const openImage = async () => {
    if (props.imgBase64 === null) {
      try {
        const image = await getActivityImage(props.activityId!);
        props.handleChange(image);
        openImageInTab(image);
      } catch (e) {
        props.toggleErrorModal();
      }
    } else {
      openImageInTab(props.imgBase64);
    }
  };

  const hasImage = props.hasImage || props.imgBase64;

  return (
    <div className={styles.image}>
      <span>{t("activity_form.image")}</span>
      <div>
        <ImageFile
          label="Upload image"
          value={props.imgBase64}
          onChange={props.handleChange}
        />
        {hasImage && (
          <Button type="button" data-testid="open-image" onClick={openImage}>
            Ver
          </Button>
        )}
        {hasImage && (
          <Button
            type="button"
            data-testid="delete-image"
            onClick={() => props.handleChange(null)}
          >
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadImage;

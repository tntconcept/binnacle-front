import React from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import {useTranslation} from "react-i18next"
import {useFormikContext} from "formik"
import {ActivityFormValues} from "core/forms/ActivityForm/ActivityForm"
import {IRecentRole} from "api/interfaces/IRecentRole"

interface IToggleRecentRolesButton {
  showRecentRoles: boolean;
  recentRoleExist?: IRecentRole
  onToggle: (newState: boolean) => void;
}

const ToggleRecentRolesButton: React.FC<IToggleRecentRolesButton> = props => {
  const { t } = useTranslation();
  const formik = useFormikContext<ActivityFormValues>();

  const handleClick = () => {
    if (!props.showRecentRoles) {
      formik.setValues(
        {
          ...formik.values,
          organization: undefined,
          project: undefined,
          role: undefined
        },
        false
      );
      props.onToggle(true);
    } else {
      formik.setValues(
        {
          ...formik.values,
          organization: props.recentRoleExist
            ? (({ foo: true } as unknown) as any)
            : undefined,
          project: props.recentRoleExist
            ? (({ foo: true } as unknown) as any)
            : undefined,
          role: props.recentRoleExist
            ? {
              id: props.recentRoleExist!.id,
              name: props.recentRoleExist!.name
            }
            : undefined
        },
        false
      );
      props.onToggle(false);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      type="button">
      {!props.showRecentRoles ? (
        t("activity_form.back_to_recent_roles")
      ) : (
        <span>+ {t("activity_form.add_role")}</span>
      )}
    </button>
  );
};

export default ToggleRecentRolesButton;

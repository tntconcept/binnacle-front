import React from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import {useTranslation} from "react-i18next"
import {IRecentRole} from "api/interfaces/IRecentRole"

interface IToggleRecentRolesButton {
  showRecentRoles: boolean;
  recentRoleExist?: IRecentRole
  onToggle: (newState: boolean) => void;
}

const ToggleRecentRolesButton: React.FC<IToggleRecentRolesButton> = props => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (props.showRecentRoles) {
      props.onToggle(false);
    } else {
      props.onToggle(true);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      type="button">
      {props.showRecentRoles ? (
        <span>+ {t("activity_form.add_role")}</span>
      ) : (
        t("activity_form.back_to_recent_roles")
      )}
    </button>
  );
};

export default ToggleRecentRolesButton;

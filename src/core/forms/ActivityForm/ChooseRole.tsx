import React from "react"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import ToggleRecentRolesButton from "core/forms/ActivityForm/ToggleRecentRolesButton"
import RecentRolesList from "core/forms/ActivityForm/RecentRolesList"
import SelectRole from "core/forms/ActivityForm/SelectRole"
import {useTranslation} from "react-i18next"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {useFormikContext} from "formik"
import {ActivityFormValues} from "core/forms/ActivityForm/ActivityForm"

interface IChooseRole {
  showRecentRoles: boolean;
  toggleRecentRoles: (state: boolean) => void;
  recentRoleExists?: IRecentRole;
}

const ChooseRole: React.FC<IChooseRole> = ({
  showRecentRoles,
  toggleRecentRoles,
  recentRoleExists
}) => {
  const { t } = useTranslation();

  const formik = useFormikContext<ActivityFormValues>();

  const handleToggleRecentRoles = (state: boolean) => {
    if (!state) {
      formik.setValues({
        ...formik.values,
        organization: undefined,
        project: undefined,
        role: undefined
      }, false);
    } else if (state && recentRoleExists) {
      formik.setFieldValue("role", {
        "id": recentRoleExists.id,
        "name": recentRoleExists.name
      }, false)
    }
    toggleRecentRoles(state)
  };

  return (
    <div className={styles.entities}>
      <div
        className={styles.selectsContainer}
        role="group"
        aria-labelledby="selects_head"
      >
        <div id="selects_head" className={styles.selectsTitle}>
          {showRecentRoles
            ? t("activity_form.recent_roles")
            : t("activity_form.select_role")}
        </div>
        {recentRoleExists && (
          <ToggleRecentRolesButton
            showRecentRoles={showRecentRoles}
            onToggle={handleToggleRecentRoles}
            recentRoleExist={recentRoleExists}
          />
        )}
        {showRecentRoles ? <RecentRolesList /> : <SelectRole />}
      </div>
    </div>
  );
};

export default ChooseRole;

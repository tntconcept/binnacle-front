import React from 'react'
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import ToggleRecentRolesButton from "core/forms/ActivityForm/ToggleRecentRolesButton"
import RecentRolesList from "core/forms/ActivityForm/RecentRolesList"
import SelectRole from "core/forms/ActivityForm/SelectRole"
import {useTranslation} from "react-i18next"
import {IRecentRole} from "api/interfaces/IRecentRole"

interface IChooseRole {
  showRecentRoles: boolean,
  toggleRecentRoles: (state: boolean) => void
  recentRoleExists?: IRecentRole
}

const ChooseRole: React.FC<IChooseRole> = ({showRecentRoles, toggleRecentRoles, recentRoleExists}) => {
  const { t } = useTranslation()

  return (
    <div className={styles.entities}>
      <div
        className={styles.selectsContainer}
        role="group"
        aria-labelledby="selects_head"
      >
        <div
          id="selects_head"
          className={styles.selectsTitle}>
          { showRecentRoles
            ? t("activity_form.recent_roles")
            : t("activity_form.select_role")}
        </div>
        {recentRoleExists && (
          <ToggleRecentRolesButton
            showRecentRoles={recentRoleExists !== undefined}
            onToggle={toggleRecentRoles}
            recentRoleExist={recentRoleExists}
          />
        )}
        {showRecentRoles ? <RecentRolesList /> : <SelectRole />}
      </div>
    </div>
  )
}

export default ChooseRole

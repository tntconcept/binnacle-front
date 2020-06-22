import React from 'react'
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg'
import styles from 'features/ActivityForm/ActivityForm.module.css'
import { useTranslation } from 'react-i18next'
import { IRecentRole } from 'api/interfaces/IRecentRole'

interface IToggleRecentRolesButton {
  showRecentRoles: boolean
  recentRoleExist?: IRecentRole
  onToggle: (newState: boolean) => void
}

const ToggleRecentRolesButton: React.FC<IToggleRecentRolesButton> = (props) => {
  const { t } = useTranslation()

  const handleClick = () => {
    if (props.showRecentRoles) {
      props.onToggle(false)
    } else {
      props.onToggle(true)
    }
  }

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      type="button">
      {props.showRecentRoles ? (
        <span className={styles.toggleButtonSpan}>
          <PlusIcon className={styles.toggleButtonIcon} />
          {t('activity_form.add_role')}
        </span>
      ) : (
        <span className={styles.toggleButtonSpan}>
          {t('activity_form.back_to_recent_roles')}
        </span>
      )}
    </button>
  )
}

export default ToggleRecentRolesButton

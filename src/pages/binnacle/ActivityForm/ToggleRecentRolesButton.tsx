import React from 'react'
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg'
import styles from 'pages/binnacle/ActivityForm/ActivityForm.module.css'
import { useTranslation } from 'react-i18next'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { Button } from '@chakra-ui/core'

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
    <Button
      leftIcon={props.showRecentRoles ? <PlusIcon className={styles.toggleButtonIcon} /> : null}
      onClick={handleClick}
      type="button"
      variant="ghost"
      size="sm"
      position="absolute"
      top={0}
      right={0}
    >
      {props.showRecentRoles ? (
        <span className={styles.toggleButtonSpan}>{t('activity_form.add_role')}</span>
      ) : (
        <span className={styles.toggleButtonSpan}>{t('activity_form.back_to_recent_roles')}</span>
      )}
    </Button>
  )
}

export default ToggleRecentRolesButton

import React from 'react'
import { ReactComponent as PlusIcon } from 'heroicons/outline/plus.svg'
import { useTranslation } from 'react-i18next'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { Button, Icon } from '@chakra-ui/core'

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
      leftIcon={props.showRecentRoles ? <Icon as={PlusIcon} /> : undefined}
      onClick={handleClick}
      type="button"
      variant="ghost"
      size="sm"
      position="absolute"
      top={0}
      right={0}
      fontSize="sm"
      zIndex="2"
    >
      {props.showRecentRoles
        ? t('activity_form.add_role')
        : t('activity_form.back_to_recent_roles')}
    </Button>
  )
}

export default ToggleRecentRolesButton

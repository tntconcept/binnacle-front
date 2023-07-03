import { Button, Icon } from '@chakra-ui/react'
import { PlusIcon } from '@heroicons/react/outline'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  showRecentRoles: boolean
  onToggle: () => void
}

export const ToggleButton: FC<Props> = (props) => {
  const { t } = useTranslation()

  return (
    <Button
      leftIcon={props.showRecentRoles ? <Icon as={PlusIcon} /> : undefined}
      onClick={props.onToggle}
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

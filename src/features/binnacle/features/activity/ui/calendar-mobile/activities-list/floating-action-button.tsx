import { Icon, IconButton, useColorModeValue } from '@chakra-ui/react'
import { PlusIcon } from '@heroicons/react/outline'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAction } from 'shared/arch/hooks/use-action'
import { paths } from 'shared/router/paths'

export const FloatingActionButton: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const bgColor = useColorModeValue(undefined, 'darkBrand.400')

  const openCreateActivityForm = useAction(OpenCreateActivityFormAction)
  const handleOpenCreateActivityForm = () => {
    openCreateActivityForm()
    navigate(paths.activity)
  }

  return (
    <IconButton
      onClick={handleOpenCreateActivityForm}
      icon={<Icon as={PlusIcon} boxSize={6} />}
      aria-label={t('accessibility.new_activity')}
      isRound={true}
      colorScheme="brand"
      data-testid="add_activity"
      size="lg"
      position="fixed"
      right="16px"
      bottom="20px"
      bgColor={bgColor}
    />
  )
}

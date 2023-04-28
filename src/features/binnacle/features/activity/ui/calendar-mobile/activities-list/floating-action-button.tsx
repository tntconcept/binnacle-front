import { Icon, IconButton, useColorModeValue } from '@chakra-ui/react'
import { PlusIcon } from '@heroicons/react/outline'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

type FloatingActionButtonProps = {
  onClick(): void
}
export const FloatingActionButton: FC<FloatingActionButtonProps> = ({ onClick }) => {
  const { t } = useTranslation()

  const bgColor = useColorModeValue(undefined, 'darkBrand.400')

  return (
    <IconButton
      onClick={onClick}
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

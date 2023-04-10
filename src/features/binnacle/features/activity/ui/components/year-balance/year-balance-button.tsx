import { Icon, IconButton, useDisclosure } from '@chakra-ui/react'
import { ChartBarIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'
import { YearBalanceModal } from './year-balance-modal'

export const YearBalanceButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { t } = useTranslation()

  return (
    <>
      <IconButton
        icon={<Icon as={ChartBarIcon} boxSize={5} color={'#A0AEC0'} />}
        isRound
        size="sm"
        variant="ghost"
        data-testid="year_balance_button"
        aria-label={t('year_balance.showYearBalanceModal')}
        onClick={onOpen}
      />
      {isOpen && <YearBalanceModal onClose={onClose} />}
    </>
  )
}

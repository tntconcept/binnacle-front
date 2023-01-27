import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal'
import { Button, Flex, Text } from '@chakra-ui/react'
import { GetYearBalanceAction } from 'modules/binnacle/data-access/actions/get-year-balance-action'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionOnMount } from 'shared/arch/hooks/use-action-on-mount'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { useIsMobile } from 'shared/hooks'
import { YearBalanceChart } from './YearBalanceChart/YearBalanceChart'
import { YearBalanceTable } from './YearBalanceTable/YearBalanceTable'

type YearBalanceModalProps = {
  onClose(): void
}

export const YearBalanceModal: React.FC<YearBalanceModalProps> = ({ onClose }) => {
  const { t } = useTranslation()
  const [showData, setShowData] = useState(false)
  const { yearBalance } = useGlobalState(BinnacleState)
  const isMobile = useIsMobile()

  const showChart = !isMobile && !showData && yearBalance
  const showTable = yearBalance && (isMobile || showData)

  useActionOnMount(GetYearBalanceAction)

  const onToggleData = () => {
    setShowData(!showData)
  }

  const handleClose = () => {
    setShowData(false)
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={handleClose} size="full" isCentered={!isMobile}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('year_balance.title')}</ModalHeader>
        <ModalCloseButton />

        {!isMobile && (
          <Flex justify="flex-end" paddingRight={4}>
            <Button variant={'outline'} onClick={onToggleData}>
              <Text as="span" fontSize="xs">
                {showData ? t('year_balance.showChart') : t('year_balance.showData')}
              </Text>
            </Button>
          </Flex>
        )}

        <ModalBody>
          {showChart && <YearBalanceChart yearBalance={yearBalance} />}
          {showTable && <YearBalanceTable yearBalance={yearBalance} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

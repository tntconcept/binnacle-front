import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal'
import { Button, Flex, Text } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetYearBalanceQry } from '../../../application/get-year-balance-qry'
import { YearBalanceChart } from './year-balance-chart/year-balance-chart'
import { YearBalanceTable } from './year-balance-table/year-balance-table'
import { useGetSelectedCalendarDate } from '../../hooks/use-get-selected-calendar-date'
import { useCalendarContext } from '../../contexts/calendar-context'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'

type YearBalanceModalProps = {
  onClose(): void
}

export const YearBalanceModal: FC<YearBalanceModalProps> = ({ onClose }) => {
  const { t } = useTranslation()
  const [showData, setShowData] = useState(false)
  const isMobile = useIsMobile()
  const { selectedDate } = useCalendarContext()
  const currentDate = useGetSelectedCalendarDate(selectedDate)
  const { result: yearBalance } = useExecuteUseCaseOnMount(GetYearBalanceQry, currentDate)

  const showChart = !isMobile && !showData && yearBalance
  const showTable = yearBalance && (isMobile || showData)

  const onToggleData = () => {
    setShowData(!showData)
  }

  const handleClose = () => {
    setShowData(false)
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={handleClose} size="full">
      <ModalOverlay />
      <ModalContent overflow={showTable ? 'hidden' : 'auto'}>
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

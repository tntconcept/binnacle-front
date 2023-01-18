import {
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { ChartBarIcon } from '@heroicons/react/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarChart } from './CalendarChart'

export const CalendarChartButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { t } = useTranslation()

  return (
    <>
      <IconButton
        icon={<Icon as={ChartBarIcon} boxSize={5} color={'#A0AEC0'} />}
        isRound
        size="sm"
        variant="ghost"
        data-testid="next_month_button"
        aria-label={t('time_tracking.calendar_chart')}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Year balance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CalendarChart />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

import {
  Button,
  HStack,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
  Portal
} from '@chakra-ui/react'
import { useState } from 'react'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { AppState } from 'shared/data-access/state/app-state'
import chrono from 'shared/utils/chrono'
import FocusLock from 'react-focus-lock'
import { useEffect } from 'react'
import { MonthsList } from './MonthsList'
import { YearsList } from './YearsList'
import { useTranslation } from 'react-i18next'

interface Props {
  selectedDate: Date
}

// TODO: initial focus should be the current year
export const CalendarPicker = (props: Props) => {
  const { t } = useTranslation()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { loggedUser } = useGlobalState(AppState)
  const [selectedYear, setSelectedYear] = useState<Date | null>(null)

  const showYearsList = selectedYear === null

  useEffect(() => {
    if (isOpen) {
      setSelectedYear(null)
    }
  }, [isOpen])

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button variant="ghost" colorScheme="gray">
          <HStack mx="3" data-testid="selected_date">
            <Text as="span" fontSize="2xl" fontWeight="900">
              {chrono(props.selectedDate).format('MMMM')}
            </Text>
            <Text as="span" fontSize="2xl">
              {chrono(props.selectedDate).format('yyyy')}
            </Text>
          </HStack>
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverHeader border="0" pb="0">
            {t('calendar_popover.select_year_month_title')}
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <FocusLock returnFocus persistentFocus={false}>
              {showYearsList ? (
                <YearsList
                  hiringDate={loggedUser!.hiringDate}
                  onSelect={(year: Date) => setSelectedYear(year)}
                />
              ) : (
                <MonthsList
                  hiringDate={loggedUser!.hiringDate}
                  selectedYear={selectedYear!}
                  onClose={onClose}
                />
              )}
            </FocusLock>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

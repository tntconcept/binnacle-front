import {
  Button,
  HStack,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { AppState } from 'shared/data-access/state/app-state'
import chrono from 'shared/utils/chrono'
import FocusLock from 'react-focus-lock'
import { MonthsList } from './MonthsList'
import { YearsList } from './YearsList'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'shared/utils/capitalize'

interface Props {
  selectedDate: Date
}

export const CalendarPicker = (props: Props) => {
  const { selectedDate } = props

  const { t } = useTranslation()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { loggedUser } = useGlobalState(AppState)
  const [selectedYear, setSelectedYear] = useState<Date | null>(null)

  const showYearsList = selectedYear === null

  const [selectedMonthName, setSelectedMonthName] = useState<string | null>('')
  const [selectedYearNumber, setSelectedYearNumber] = useState<string | null>(null)

  useEffect(() => {
    const monthName = chrono(selectedDate).format('MMMM')
    const yearName = chrono(selectedDate).format('yyyy')

    setSelectedMonthName(capitalize(monthName))
    setSelectedYearNumber(yearName)
  }, [selectedDate])

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
              {selectedMonthName}
            </Text>
            <Text as="span" fontSize="2xl">
              {selectedYearNumber}
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

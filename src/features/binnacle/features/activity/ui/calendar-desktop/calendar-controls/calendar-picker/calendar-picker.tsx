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
import chrono from 'shared/utils/chrono'
import FocusLock from 'react-focus-lock'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'shared/utils/capitalize'
import { YearsList } from './years-list'
import { MonthsList } from './months-list'
import { useCalendarContext } from '../../../contexts/calendar-context'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { GetUserLoggedQry } from 'features/user/application/get-user-logged-qry'

export const CalendarPicker = () => {
  const { selectedDate } = useCalendarContext()

  const { t } = useTranslation()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { isLoading, result: loggedUser } = useExecuteUseCaseOnMount(GetUserLoggedQry)
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
        <Button variant="outline" colorScheme="gray">
          <HStack mx="0" data-testid="selected_date">
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
            {!isLoading && (
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
            )}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

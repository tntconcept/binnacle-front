import React, { useReducer } from 'react'
import { format, isThisMonth } from 'date-fns'
import {
  Box,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure
} from '@chakra-ui/core'
import { ReactComponent as ChevronLeft } from 'assets/icons/chevron-left.svg'
import { ReactComponent as ChevronRight } from 'assets/icons/chevron-right.svg'
import { Month } from './Month'
import { START_DATE, useDatepicker } from '@datepicker-react/hooks'
import { OnDatesChangeProps } from '@datepicker-react/hooks/lib/useDatepicker/useDatepicker'
import { Day } from 'pages/vacation/DatePicker/Day'

const initialState = {
  startDate: null,
  endDate: null,
  focusedInput: START_DATE
}

function reducer(state: OnDatesChangeProps, action: any) {
  switch (action.type) {
    case 'focusChange':
      return action.payload
    case 'dateChange':
      return action.payload
    default:
      throw new Error()
  }
}

interface Props {
  currentDate: Date
  initialSelectedDate?: { startDate: Date; endDate: Date }
  onChange: (value: string) => void
  children: (values: { onOpenDatePicker: () => void }) => React.ReactNode
}

export function DatePicker(props: Props) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...(props.initialSelectedDate || {})
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const datepicker = useDatepicker({
    startDate: state.startDate,
    endDate: state.endDate,
    focusedInput: state.focusedInput,
    minBookingDate: props.currentDate,
    onDatesChange: handleDatesChange,
    numberOfMonths: 1
  })

  function handleDatesChange(data: OnDatesChangeProps) {
    if (!data.focusedInput) {
      dispatch({
        type: 'focusChange',
        payload: { ...data, focusedInput: START_DATE }
      })
      const formatString = 'dd/MM/yyyy'
      props.onChange(
        format(state.startDate, formatString) +
          ' - ' +
          format(data.endDate!, formatString)
      )

      onClose()
    } else {
      dispatch({ type: 'dateChange', payload: data })
    }
  }

  const activeMonth = datepicker.activeMonths[0].date ?? props.currentDate

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}>
      <PopoverTrigger>{props.children({ onOpenDatePicker: onOpen })}</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          textTransform="uppercase"
        >
          {format(activeMonth, 'MMMM yyyy')}
          <Box>
            <IconButton
              aria-label="Prev month"
              icon={<ChevronLeft
                width={20}
                height={20} />}
              disabled={isThisMonth(activeMonth)}
              onClick={datepicker.goToPreviousMonths}
            />
            <IconButton
              aria-label="Next month"
              icon={<ChevronRight
                width={20}
                height={20} />}
              onClick={datepicker.goToNextMonths}
              ml={2}
            />
          </Box>
        </PopoverHeader>
        <PopoverBody pb={6}>
          {datepicker.activeMonths.map((month) => (
            <Month
              key={`${month.year}-${month.month}`}
              year={month.year}
              month={month.month}
              firstDayOfWeek={datepicker.firstDayOfWeek}
            >
              {(days) => {
                return (
                  <>
                    {days.map((day, index) => (
                      <Day
                        key={day.dayLabel || index}
                        day={day.dayLabel}
                        values={{
                          date: day.date,
                          ...datepicker
                        }}
                      />
                    ))}
                  </>
                )
              }}
            </Month>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

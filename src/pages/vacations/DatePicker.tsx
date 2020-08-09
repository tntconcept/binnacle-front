import React, { useContext, useReducer, useRef, useState } from 'react'
import { format, isThisMonth } from 'date-fns'
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@chakra-ui/core'
import { ReactComponent as ChevronLeft } from 'assets/icons/chevron-left.svg'
import { ReactComponent as ChevronRight } from 'assets/icons/chevron-right.svg'
import { START_DATE, useDatepicker, useDay, useMonth } from '@datepicker-react/hooks'
import { OnDatesChangeProps } from '@datepicker-react/hooks/lib/useDatepicker/useDatepicker'

export const datepickerContextDefaultValue = {
  focusedDate: null,
  isDateFocused: () => false,
  isDateSelected: () => false,
  isDateHovered: () => false,
  isDateBlocked: () => false,
  isFirstOrLastSelectedDate: () => false,
  onDateFocus: () => {},
  onDateHover: () => {},
  onDateSelect: () => {}
}
const DatepickerContext = React.createContext<any>(datepickerContextDefaultValue)

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

export function DatePicker() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [inputValue, setInputValue] = useState('')

  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths
  } = useDatepicker({
    startDate: state.startDate,
    endDate: state.endDate,
    focusedInput: state.focusedInput,
    onDatesChange: function handleDatesChange(data: OnDatesChangeProps) {
      if (!data.focusedInput) {
        dispatch({
          type: 'focusChange',
          payload: { ...data, focusedInput: START_DATE }
        })
      } else {
        dispatch({ type: 'dateChange', payload: data })
      }
    },
    numberOfMonths: 1
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover
      }}
    >
      <label htmlFor="date-picker">Periodo de vacaciones</label>
      <input
        type="text"
        id="date-picker"
        onClick={onOpen}
        value={inputValue}
        onChange={() => {}}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            Selecciona un periodo
            <IconButton
              aria-label="Prev month"
              icon={<ChevronLeft
                width={20}
                height={20} />}
              disabled={isThisMonth(activeMonths[0].date ?? new Date())}
              onClick={goToPreviousMonths}
            />
            <IconButton
              aria-label="Next month"
              icon={<ChevronRight
                width={20}
                height={20} />}
              onClick={goToNextMonths}
            />
          </ModalHeader>
          <ModalBody pb={6}>
            {activeMonths.map((month) => (
              <Month
                key={`${month.year}-${month.month}`}
                year={month.year}
                month={month.month}
                firstDayOfWeek={firstDayOfWeek}
              />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                const formatString = 'EEEE, dd/MM/yyyy'

                console.log(
                  'format',
                  format(state.startDate, formatString) +
                    ' - ' +
                    format(state.endDate, formatString)
                )

                setInputValue(
                  format(state.startDate, formatString) +
                    ' - ' +
                    format(state.endDate, formatString)
                )
                onClose()
              }}
            >
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DatepickerContext.Provider>
  )
}

function Month({ year, month, firstDayOfWeek }: any) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek
  })

  return (
    <div>
      <div style={{ textAlign: 'center', margin: '0 0 16px' }}>
        <strong>{monthLabel}</strong>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          justifyContent: 'center'
        }}
      >
        {weekdayLabels.map((dayLabel) => (
          <div
            style={{ textAlign: 'center' }}
            key={dayLabel}>
            {dayLabel}
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          justifyContent: 'center'
        }}
      >
        {days.map((day, index) => (
          //@ts-ignore
          <Day
            date={day.date}
            key={day.dayLabel || index}
            day={day.dayLabel} />
        ))}
      </div>
    </div>
  )
}

function Day({ day, date }: any) {
  const dayRef = useRef(null)
  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateSelect,
    onDateFocus,
    onDateHover
  } = useContext(DatepickerContext)
  const {
    isSelected,
    isSelectedStartOrEnd,
    onClick,
    onKeyDown,
    onMouseEnter,
    tabIndex
  } = useDay({
    date,
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    dayRef
  })

  if (!day) {
    return <div />
  }

  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      type="button"
      ref={dayRef}
      style={{
        color: isSelected || isSelectedStartOrEnd ? 'white' : 'black',
        background: isSelected || isSelectedStartOrEnd ? 'blue' : 'white'
      }}
      data-testid={isSelected || isSelectedStartOrEnd ? 'is-selected' : undefined}
    >
      {day}
    </button>
  )
}

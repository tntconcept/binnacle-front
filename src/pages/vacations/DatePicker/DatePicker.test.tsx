import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { DatePicker } from 'pages/vacations/DatePicker/DatePicker'

describe('DatePicker', () => {
  test('by default the input has no value', () => {
    render(<DatePicker currentDate={new Date('2020-08-03')} />)
    expect(screen.getByLabelText('Periodo de vacaciones')).toHaveDisplayValue('')
  })

  test('go to previous month is disabled if the current month is shown', () => {
    render(<DatePicker currentDate={new Date('2020-08-03')} />)

    // When the user clicks
    userEvent.click(screen.getByLabelText('Periodo de vacaciones'))

    expect(screen.getByLabelText('Prev month')).toBeDisabled()

    userEvent.click(screen.getByLabelText('Next month'))

    expect(screen.getByLabelText('Prev month')).not.toBeDisabled()
  })

  test('By default the calendar has no selected date', () => {
    render(<DatePicker currentDate={new Date('2020-08-03')} />)

    userEvent.click(screen.getByLabelText('Periodo de vacaciones'))
    expect(screen.queryByTestId('is-selected')).not.toBeInTheDocument()
  })

  test('if already the period is selected, when the user selects other date it starts again from zero', () => {
    render(<DatePicker currentDate={new Date('2020-08-03')} />)

    userEvent.click(screen.getByLabelText('Periodo de vacaciones'))

    userEvent.click(screen.getByRole('button', { name: '12' }))
    userEvent.click(screen.getByRole('button', { name: '14' }))

    // reopen the modal
    userEvent.click(screen.getByLabelText('Periodo de vacaciones'))
    expect(screen.getAllByTestId('is-selected')).toHaveLength(3)

    userEvent.click(screen.getByRole('button', { name: '19' }))
    expect(screen.getAllByTestId('is-selected')).toHaveLength(1)

    userEvent.click(screen.getByRole('button', { name: '20' }))

    // reopen the modal
    userEvent.click(screen.getByLabelText('Periodo de vacaciones'))
    expect(screen.getAllByTestId('is-selected')).toHaveLength(2)
  })

  test('select date range period in one month', () => {
    render(<DatePicker currentDate={new Date('2020-08-03')} />)

    userEvent.click(screen.getByLabelText('Periodo de vacaciones'))

    expect(screen.getByLabelText('Selecciona un periodo')).toBeInTheDocument()

    // 1. The user select the start date
    userEvent.click(screen.getByRole('button', { name: '12' }))

    // 2. The user select the end date
    userEvent.click(screen.getByRole('button', { name: '14' }))

    expect(screen.getByLabelText('Periodo de vacaciones')).toHaveDisplayValue(
      '12/08/2020 - 14/08/2020'
    )
  })

  test('select date range period between two months', () => {
    render(<DatePicker currentDate={new Date('2020-08-03')} />)
    // When the user clicks
    userEvent.click(screen.getByLabelText('Periodo de vacaciones'))

    // 1. The user select the start date
    userEvent.click(screen.getByRole('button', { name: '12' }))

    // 2. The user changes the month
    userEvent.click(screen.getByLabelText('Next month'))

    // 3. The user select the end date
    userEvent.click(screen.getByRole('button', { name: '14' }))

    expect(screen.getByLabelText('Periodo de vacaciones')).toHaveDisplayValue(
      '12/08/2020 - 14/09/2020'
    )
  })

  // TODO verify that alerts correctly
  // TODO keyboard navigation

  test('The past days are disabled', () => {
    render(<DatePicker currentDate={new Date('2020-08-03')} />)

    // When the user clicks
    userEvent.click(screen.getByLabelText('Periodo de vacaciones'))

    expect(screen.getByText('01')).toBeDisabled()
    expect(screen.getByText('02')).toBeDisabled()
    expect(screen.getByText('03')).not.toBeDisabled()
  })

  test.todo('The holiday days are disabled')
})

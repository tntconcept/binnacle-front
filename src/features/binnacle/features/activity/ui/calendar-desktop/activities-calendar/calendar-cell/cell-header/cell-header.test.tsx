import { render, screen, userEvent, waitFor } from 'test-utils/app-test-utils'
import { chrono } from 'shared/utils/chrono'
import { HolidayMother } from '../../../../../../../../../test-utils/mothers/holiday-mother'
import { VacationMother } from '../../../../../../../../../test-utils/mothers/vacation-mother'
import { CellHeader } from './cell-header'
import { Vacation } from '../../../../../../vacation/domain/vacation'
import { ActivityMother } from '../../../../../../../../../test-utils/mothers/activity-mother'
import { Activity } from '../../../../../domain/activity'
import { Holiday } from '../../../../../../holiday/domain/holiday'

describe('CellHeader', () => {
  it('should show holiday description', () => {
    setup({})

    expect(screen.getByText('Test holiday')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Test holiday')
    )
  })
  it('should show vacation description', () => {
    setup({})

    expect(screen.getByText('Test holiday')).toBeInTheDocument()
  })
  it('should display today date', () => {
    setup({})

    expect(screen.getByTestId('today')).toHaveTextContent(new Date().getDate().toString())
  })

  it('should display date', () => {
    const date = new Date('2021-07-07')
    setup({}, 100, date)

    expect(screen.getByTestId('cell-date')).toHaveTextContent(date.getDate().toString())
  })

  describe('should be accessible', () => {
    describe('tabindex', () => {
      it('should be 0 when selected month is this month and date is today', () => {
        setup({})

        expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
      })

      it('should be -1 when selected month is this month but date is not today', () => {
        setup({}, 100, chrono().minus(1, 'day').getDate(), chrono.now())

        expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1')
      })

      it('should be 0 when selected month and date are in the same month and is first day of that month', () => {
        setup({}, 100, new Date('2021-01-01'), new Date('2021-01-01'))

        expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
      })

      it('should be -1 when selected month and date are not in the same month', () => {
        setup({}, 100, new Date('2021-01-30'), new Date('2021-02-01'))

        expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1')
      })
    })

    it("should be accessible with today's date", () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2021-07-09').getTime())
      setup({})

      const today_date = hideElementContent(screen.getByRole('button'))
      expect(today_date).toMatchInlineSnapshot(`
              <button
                aria-current="date"
                aria-label="9, Friday July 2021, 100 time.hour, Test holiday"
                tabindex="0"
              />
          `)

      jest.useRealTimers()
    })

    it('should be accessible with a holiday', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2021-07-09').getTime())

      setup({}, 0)

      expect(hideElementContent(screen.getByRole('button'))).toMatchInlineSnapshot(`
        <button
          aria-current="date"
          aria-label="9, Friday July 2021, Test holiday"
          tabindex="0"
        />
      `)

      jest.useRealTimers()
    })
  })

  it('should hide time if is equal to 0', () => {
    setup({}, 0)
    expect(screen.queryByTestId('cell-time')).not.toBeInTheDocument()
  })

  it('should show time', () => {
    setup({})
    expect(screen.getByTestId('cell-time')).toHaveTextContent('100h')
  })

  it('should show verified projects', async () => {
    setup({ overideActivity: { hasEvidences: true } })

    userEvent.hover(screen.getByTestId('verified_projects'))

    await waitFor(() => {
      expect(screen.getByRole('tooltip', { name: /Billable project/i })).toBeInTheDocument()
    })
  })
})

const setup = (
  values: Partial<{
    overrideHoliday: Partial<Holiday>
    overrideVacation: Partial<Vacation>
    overideActivity: Partial<Activity>
  }>,
  time = 100,
  date = chrono.now(),
  selectedMonth = chrono.now()
) => {
  const vacation: Vacation = VacationMother.julyVacation()
  const vacationOverride: Vacation = { ...vacation, ...values.overrideHoliday }

  const holiday: Holiday = HolidayMother.marchHoliday()
  const holidayOverride: Holiday = { ...holiday, ...values.overrideVacation }

  const activity: Activity = ActivityMother.minutesBillableActivityWithoutEvidence()
  const activityOverride: Activity = { ...activity, ...values.overideActivity }

  return render(
    <CellHeader
      date={date}
      selectedMonth={selectedMonth}
      time={time}
      holiday={holidayOverride}
      vacation={vacationOverride}
      activities={[activityOverride]}
    />
  )
}

const hideElementContent = (button: HTMLElement) => {
  button.innerHTML = ''
  button.removeAttribute('class')
  return button
}

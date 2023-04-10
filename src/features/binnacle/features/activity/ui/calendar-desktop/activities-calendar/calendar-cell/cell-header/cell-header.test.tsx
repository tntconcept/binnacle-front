import { render, screen, userEvent, waitFor } from 'test-utils/app-test-utils'
import { CellHeader } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellHeader/CellHeader'
import chrono from 'shared/utils/chrono'
import { Holiday } from 'shared/types/Holiday'
import { Vacation } from 'shared/types/Vacation'
import {
  buildProject,
  mockActivity,
  mockActivityDay,
  mockHoliday,
  mockVacation
} from 'test-utils/generateTestMocks'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { container } from 'tsyringe'

describe('CellHeader', () => {
  it('should show holiday description', () => {
    const holiday = mockHoliday()
    setup({ holidays: [holiday] })

    expect(screen.getByText('Binnacle holiday')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Binnacle holiday')
    )
  })
  it('should show vacation description', () => {
    const vacation = mockVacation()
    setup({ vacations: [vacation], date: new Date('2021-07-08') })

    expect(screen.getByText('vacations')).toBeInTheDocument()
  })
  it('should display today date', () => {
    setup({ date: new Date() })

    expect(screen.getByTestId('today')).toHaveTextContent(new Date().getDate().toString())
  })

  it('should display date', () => {
    const date = new Date('2021-07-07')
    setup({ date })

    expect(screen.getByTestId('cell-date')).toHaveTextContent(date.getDate().toString())
  })

  describe('should be accessible', () => {
    describe('tabindex', () => {
      it('should be 0 when selected month is this month and date is today', () => {
        setup({ date: new Date(), selectedMonth: new Date() })

        expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
      })

      it('should be -1 when selected month is this month but date is not today', () => {
        setup({
          date: chrono().minus(1, 'day').getDate(),
          selectedMonth: chrono.now()
        })

        expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1')
      })

      it('should be 0 when selected month and date are in the same month and is first day of that month', () => {
        setup({ date: new Date('2021-01-01'), selectedMonth: new Date('2021-01-01') })

        expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
      })

      it('should be -1 when selected month and date are not in the same month', () => {
        setup({ date: new Date('2021-01-30'), selectedMonth: new Date('2021-02-01') })

        expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1')
      })
    })

    it("should be accessible with today's date", () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2021-07-09').getTime())
      setup({ date: new Date() })

      const today_date = hideElementContent(screen.getByRole('button'))
      expect(today_date).toMatchInlineSnapshot(`
              <button
                aria-current="date"
                aria-label="9, Friday July 2021, 1 time.hour 40 time.minute"
                tabindex="0"
              />
          `)

      jest.useRealTimers()
    })

    it('should be accessible with a holiday', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2021-07-09').getTime())

      const holiday = mockHoliday()
      setup({ holidays: [holiday], time: 0 })

      expect(hideElementContent(screen.getByRole('button'))).toMatchInlineSnapshot(`
        <button
          aria-current="date"
          aria-label="9, Friday July 2021, Binnacle holiday"
          tabindex="0"
        />
      `)

      jest.useRealTimers()
    })
  })

  it('should hide time if is equal to 0', () => {
    setup({ time: 0 })
    expect(screen.queryByTestId('cell-time')).not.toBeInTheDocument()
  })

  it('should show time', () => {
    setup({ time: 75 })
    expect(screen.getByTestId('cell-time')).toHaveTextContent('1h 15m')
  })

  it('should show verified projects', async () => {
    const binnacleState = container.resolve(BinnacleState)
    binnacleState.activities = [
      mockActivityDay({
        date: new Date(),
        activities: [
          mockActivity({ hasEvidence: true, project: buildProject({ name: 'React' }) }),
          mockActivity({ hasEvidence: false, project: buildProject({ name: 'Angular' }) }),
          mockActivity({ hasEvidence: true, project: buildProject({ name: 'Vue' }) })
        ]
      }),
      mockActivityDay({
        date: chrono().plus(1, 'day').getDate(),
        activities: [
          mockActivity({ hasEvidence: true, project: buildProject({ name: 'Stencil' }) })
        ]
      })
    ]

    setup({ time: 0 })

    userEvent.hover(screen.getByTestId('verified_projects'))

    await waitFor(() => {
      expect(screen.getByRole('tooltip', { name: /React, Vue/i })).toBeInTheDocument()
    })
  })
})

const setup = (
  overrideProps?: Partial<{
    date: Date
    selectedMonth: Date
    time: number
    holidays: Holiday[]
    vacations: Vacation[]
  }>
) => {
  const defaultProps = {
    date: chrono.now(),
    selectedMonth: chrono.now(),
    time: 100,
    holidays: {
      holidays: overrideProps?.holidays ?? [],
      vacations: overrideProps?.vacations ?? []
    }
  }

  const props = { ...defaultProps, ...overrideProps }
  props.holidays = defaultProps.holidays

  return render(
    <CellHeader
      date={props.date}
      selectedMonth={props.selectedMonth}
      time={props.time}
      holidays={props.holidays}
    />
  )
}

const hideElementContent = (button: HTMLElement) => {
  button.innerHTML = ''
  button.removeAttribute('class')
  return button
}

import { waitFor } from '@testing-library/react'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { TimeUnit, TimeUnits } from 'shared/types/time-unit'
import chrono from 'shared/utils/chrono'
import { render, screen } from 'test-utils/app-test-utils'
import DurationText from './duration-text'

jest.mock('shared/arch/hooks/use-get-use-case')
const tSpy = jest.fn((str) => str)
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: tSpy,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

describe('DurationText', () => {
  it('should show the duration in hours', async () => {
    const start = chrono().getDate()
    const end = chrono().plus(2, 'hour').getDate()
    const timeUnit: TimeUnit = TimeUnits.MINUTES
    setup({ start, end, timeUnit })

    await waitFor(() => {
      expect(screen.getByText('2h')).toBeInTheDocument()
    })
  })

  it('should show 0h if start <= end ', () => {
    const start = chrono().getDate()
    const end = chrono().minus(2, 'hour').getDate()
    const timeUnit: TimeUnit = TimeUnits.MINUTES
    setup({ start, end, timeUnit })

    expect(screen.getByText('0h')).toBeInTheDocument()
  })

  it('should show the duration in days', async () => {
    const start = new Date('2023-04-07')
    const end = new Date('2023-04-10')
    const timeUnit: TimeUnit = TimeUnits.DAYS
    setup({ start, end, timeUnit, value: 2 })

    await waitFor(() => {
      expect(screen.getByText('activity_form.duration')).toBeInTheDocument()
      expect(screen.getByText('2d')).toBeInTheDocument()
    })
  })

  it('should show 0d if start <= end ', async () => {
    const start = new Date('2023-04-07')
    const end = new Date('2023-04-06')
    const timeUnit: TimeUnit = TimeUnits.DAYS
    setup({ start, end, timeUnit })
    await waitFor(() => {
      expect(screen.getByText('activity_form.duration')).toBeInTheDocument()
      expect(screen.getByText('0d')).toBeInTheDocument()
    })
  })

  it('should show the remaining time & maxAllowed', async () => {
    const start = new Date('2023-04-07')
    const end = new Date('2023-04-08')
    const timeUnit: TimeUnit = TimeUnits.MINUTES
    const maxAllowed = 120
    const remaining = 60

    setup({ start, end, timeUnit, maxAllowed, remaining })
    await waitFor(() => {
      screen.debug()
      expect(tSpy).toHaveBeenCalledWith('activity_form.remaining', {
        remaining: '1h',
        maxAllowed: '2h'
      })
    })
  })
})

const setup = ({ start, end, timeUnit, value = null, maxAllowed = 0, remaining = 0 }: any) => {
  const useCaseSpy = jest.fn()
  ;(useGetUseCase as jest.Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'GetDaysForActivityDaysPeriodQry') {
      return {
        isLoading: false,
        executeUseCase: useCaseSpy.mockResolvedValue(value)
      }
    }
  })

  render(
    <DurationText
      start={start}
      end={end}
      useDecimalTimeFormat={false}
      timeUnit={timeUnit}
      maxAllowed={maxAllowed}
      remaining={remaining}
    />
  )
}

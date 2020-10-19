import React, { Suspense } from 'react'
import { render, screen, waitFor, userEvent } from 'test-utils/app-test-utils'
import { VacationTable } from 'pages/vacation/VacationTable/VacationTable'
import { IVacation, VacationState } from 'api/interfaces/IHolidays'
import { Context as ResponsiveContext } from 'react-responsive'
import dayjs, { DATE_FORMAT } from 'services/dayjs'

describe('Vacation Table', () => {
  async function renderVacationTable(
    {
      vacations = [],
      onEdit = jest.fn(),
      onRefreshHolidays = jest.fn(),
      deleteVacationPeriod = jest.fn()
    }: any,
    isMobile: boolean = false
  ) {
    const holidaysReader = jest.fn(() => ({
      holidays: [],
      vacations: vacations
    }))

    if (isMobile) {
      render(
        <ResponsiveContext.Provider value={{ width: 300 }}>
          <Suspense fallback={<p>Skeleton test</p>}>
            <VacationTable
              // @ts-ignore
              holidays={holidaysReader}
              onEdit={onEdit}
              onRefreshHolidays={onRefreshHolidays}
              deleteVacationPeriod={deleteVacationPeriod}
            />
          </Suspense>
        </ResponsiveContext.Provider>
      )
    } else {
      render(
        <Suspense fallback={<p>Skeleton test</p>}>
          <VacationTable
            // @ts-ignore
            holidays={holidaysReader}
            onEdit={onEdit}
            onRefreshHolidays={onRefreshHolidays}
            deleteVacationPeriod={deleteVacationPeriod}
          />
        </Suspense>
      )
    }

    await waitFor(() => {
      expect(screen.queryByText('Skeleton test')).not.toBeInTheDocument()
    })

    return { holidays: vacations, onEdit, onRefreshHolidays, deleteVacationPeriod }
  }

  const allVacations: IVacation[] = [
    {
      id: 1,
      startDate: new Date('2020-03-10'),
      endDate: new Date('2020-03-10'),
      days: [new Date('2020-03-10')],
      state: VacationState.Accept,
      observations: undefined,
      description: undefined,
      chargeYear: new Date('2020-01-01')
    },
    {
      id: 2,
      startDate: new Date('2020-01-10'),
      endDate: new Date('2020-01-15'),
      days: [new Date('2020-01-10'), new Date('2020-01-15')],
      state: VacationState.Cancelled,
      observations: '8 Dias',
      description: 'Me voy de viaje',
      chargeYear: new Date('2020-01-01')
    },
    {
      id: 3,
      startDate: new Date('2020-10-08'),
      endDate: new Date('2020-10-20'),
      days: [new Date('2020-10-08'), new Date('2020-10-20')],
      state: VacationState.Pending,
      observations: '7 Días',
      description: 'Quiero vacaciones',
      chargeYear: new Date('2020-01-01')
    }
  ]

  it('should show skeleton', () => {
    const holidaysReader = jest.fn(() => {
      throw new Promise((resolve) => {})
    })

    render(
      <Suspense fallback={<p>Skeleton test</p>}>
        <VacationTable
          holidays={holidaysReader}
          onEdit={jest.fn()}
          onRefreshHolidays={jest.fn()}
          deleteVacationPeriod={jest.fn()}
        />
      </Suspense>
    )

    expect(screen.getByText('Skeleton test')).toBeInTheDocument()
  })

  describe('DESKTOP Table', () => {
    it('[DESKTOP] should show a message when vacation array is empty', async () => {
      await renderVacationTable({ vacations: [] })

      expect(screen.getByText('vacation_table.empty')).toBeInTheDocument()
    })

    it('[DESKTOP] should show vacation requests', async () => {
      await renderVacationTable({ vacations: allVacations })

      allVacations.forEach((holiday) => {
        expect(
          screen.getByText(
            `${dayjs(holiday.startDate).format(DATE_FORMAT)} - ${dayjs(holiday.endDate).format(
              DATE_FORMAT
            )}`
          )
        )
      })
    })

    it('[DESKTOP] check remove vacation operation', async () => {
      const { deleteVacationPeriod, onRefreshHolidays } = await renderVacationTable({
        vacations: [allVacations[2]]
      })

      // Open the delete modal
      userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))

      // CANCEL the delete operation
      userEvent.click(screen.getByRole('button', { name: /actions.cancel/i }))
      expect(deleteVacationPeriod).not.toHaveBeenCalled()
      expect(onRefreshHolidays).not.toHaveBeenCalled()

      // Open the delete modal again
      userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))

      // CONFIRM the delete operation
      userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))
      expect(deleteVacationPeriod).toHaveBeenCalledWith(allVacations[2].id)

      await waitFor(() => {
        expect(onRefreshHolidays).toHaveBeenCalled()
      })
    })

    it('[DESKTOP] edit the vacation request when the user click on the edit button', async () => {
      const { onEdit } = await renderVacationTable({
        vacations: [allVacations[2]]
      })

      userEvent.click(screen.getByRole('button', { name: /actions.edit/i }))
      expect(onEdit).toHaveBeenCalledWith(allVacations[2])
    })
  })
  describe('MOBILE Table', () => {
    it('[MOBILE] should show a message when vacation array is empty', async () => {
      await renderVacationTable({ vacations: [] }, true)

      expect(screen.getByText('vacation_table.empty')).toBeInTheDocument()
    })

    it('[MOBILE] should show vacation requests', async () => {
      await renderVacationTable({ vacations: allVacations }, true)

      expect(
        screen.getByRole('button', {
          name: '2020-03-10 - 2020-03-10 1 vacation_table.state_accept'
        })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', {
          name: '2020-01-10 - 2020-01-15 2 vacation_table.state_canceled'
        })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', {
          name: '2020-10-08 - 2020-10-20 2 vacation_table.state_pending'
        })
      ).toBeInTheDocument()
    })

    it('[MOBILE] check remove vacation operation', async () => {
      const { deleteVacationPeriod, onRefreshHolidays } = await renderVacationTable(
        {
          vacations: [allVacations[2]]
        },
        true
      )

      // Expand the vacation
      userEvent.click(screen.getByRole('button', { name: /2020-10-08 - 2020-10-20/i }))

      // Open the delete modal
      userEvent.click(await screen.findByRole('button', { name: /actions.remove/i }))

      // CANCEL the delete operation
      userEvent.click(screen.getByRole('button', { name: /actions.cancel/i }))
      expect(deleteVacationPeriod).not.toHaveBeenCalled()
      expect(onRefreshHolidays).not.toHaveBeenCalled()

      // Open the delete modal again
      userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))

      // CONFIRM the delete operation
      userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))
      expect(deleteVacationPeriod).toHaveBeenCalledWith(allVacations[2].id)

      await waitFor(() => {
        expect(onRefreshHolidays).toHaveBeenCalled()
      })
    })

    it('[MOBILE] edit the vacation request when the user click on the edit button', async () => {
      const { onEdit } = await renderVacationTable(
        {
          vacations: [allVacations[2]]
        },
        true
      )

      // Expand the vacation
      userEvent.click(screen.getByRole('button', { name: /2020-10-08 - 2020-10-20/i }))

      userEvent.click(await screen.findByRole('button', { name: /actions.edit/i }))
      expect(onEdit).toHaveBeenCalledWith(allVacations[2])
    })
  })
})

import React, { Suspense } from 'react'
import { render } from '../../src/test-utils/app-test-utils'
import { VacationTable } from '../../src/pages/vacation/VacationTable/VacationTable'
import { PrivateHolidayState } from '../../src/api/interfaces/IHolidays'
import { formatVacationPeriod } from '../../src/pages/vacation/VacationTable/VacationTable.utils'

describe('Vacation Table', () => {
  function renderVacationTable({
    holidays = [],
    onEdit = cy.stub(),
    onRefreshHolidays = cy.stub(),
    deleteVacationPeriod = cy.stub()
  }: any) {
    const holidaysReader = cy.stub().returns({
      privateHolidays: holidays
    })

    render(
      <Suspense fallback={<p>Skeleton test</p>}>
        <VacationTable
          holidays={holidaysReader}
          onEdit={onEdit}
          onRefreshHolidays={onRefreshHolidays}
          deleteVacationPeriod={deleteVacationPeriod}
        />
      </Suspense>
    )

    return { holidays, onEdit, onRefreshHolidays, deleteVacationPeriod }
  }

  it('should show skeleton', () => {
    const holidaysReader = cy.stub().throws(new Promise((resolve) => {}))

    render(
      <Suspense fallback={<p>Skeleton test</p>}>
        <VacationTable
          holidays={holidaysReader}
          onEdit={cy.stub()}
          onRefreshHolidays={cy.stub()}
          deleteVacationPeriod={cy.stub()}
        />
      </Suspense>
    )

    cy.findByText('Skeleton test')
      .should('exist')
      .and('be.visible')
  })

  context('desktop', () => {
    it('[DESKTOP] should show a message when vacation array is empty', () => {
      renderVacationTable({ holidays: [] })

      cy.findByText('There is no registered vacation period').should('exist')
    })

    it('[DESKTOP] should show vacation requests', function() {
      const holidays = [
        {
          id: 1,
          days: [new Date('2020-03-10')],
          state: PrivateHolidayState.Accept,
          observations: undefined,
          userComment: undefined
        },
        {
          id: 2,
          days: [new Date('2020-01-10'), new Date('2020-01-15')],
          state: PrivateHolidayState.Cancelled,
          observations: '8 Dias',
          userComment: 'Me voy de viaje'
        },
        {
          id: 3,
          days: [new Date('2020-10-08'), new Date('2020-10-20')],
          state: PrivateHolidayState.Pending,
          observations: '7 Días',
          userComment: 'Quiero vacaciones'
        }
      ]
      renderVacationTable({ holidays: holidays })

      cy.get('tbody > tr').each(($vacationRequestRow, index) => {
        const holiday = holidays[index]

        cy.wrap($vacationRequestRow).within(() => {
          cy.get('td')
            .eq(0)
            .contains(formatVacationPeriod(holiday.days))
          cy.get('td')
            .eq(1)
            .contains(holiday.days.length.toString())
          cy.get('td')
            .eq(2)
            .contains(holiday.state.toString(), { matchCase: false })
          cy.get('td')
            .eq(3)
            .contains(holiday.userComment || '-')
          cy.get('td')
            .eq(4)
            .contains(holiday.observations || '-')

          if (holiday.state === PrivateHolidayState.Pending) {
            cy.get('td')
              .eq(5)
              .contains('button', 'Edit')
            cy.get('td')
              .eq(5)
              .contains('button', 'Remove')
          } else {
            cy.get('td')
              .eq(5)
              .should('be.empty')
          }
        })
      })
    })

    it('[DESKTOP] do NOT delete a vacation request when the user cancel the operation', () => {
      const { deleteVacationPeriod, onRefreshHolidays } = renderVacationTable({
        holidays: [
          {
            id: 3,
            days: [new Date('2020-10-08'), new Date('2020-10-20')],
            state: PrivateHolidayState.Pending,
            observations: '7 Días',
            userComment: 'Quiero vacaciones'
          }
        ]
      })

      // Open the alert dialog
      cy.findByRole('button', { name: /remove/i }).click()

      // Click on the cancel button
      cy.findByText('Remove vacation period')
        .parent()
        .within(() => {
          cy.findByRole('button', { name: /cancel/i })
            .click()
            .then(() => {
              expect(deleteVacationPeriod).not.toHaveBeenCalled()
              expect(onRefreshHolidays).not.toHaveBeenCalled()
            })
        })
    })

    it('[DESKTOP] delete the vacation request when the user confirm the operation', () => {
      const holiday = {
        id: 3,
        days: [new Date('2020-10-08'), new Date('2020-10-20')],
        state: PrivateHolidayState.Pending,
        observations: '7 Días',
        userComment: 'Quiero vacaciones'
      }
      const { deleteVacationPeriod, onRefreshHolidays } = renderVacationTable({
        holidays: [holiday]
      })

      // Open the alert dialog
      cy.findByRole('button', { name: /remove/i }).click()

      // Click on the remove button
      cy.findByText('Remove vacation period')
        .parent()
        .within(() => {
          cy.findByRole('button', { name: /remove/i })
            .click()
            .then(() => {
              expect(deleteVacationPeriod).toHaveBeenCalledWith(holiday.id)
              expect(onRefreshHolidays).toHaveBeenCalled()
            })
        })
    })

    it('[DESKTOP] edit the vacation request when the user click on the edit button', () => {
      const holiday = {
        id: 3,
        days: [new Date('2020-10-08'), new Date('2020-10-20')],
        state: PrivateHolidayState.Pending,
        observations: '7 Días',
        userComment: 'Quiero vacaciones'
      }
      const { onEdit } = renderVacationTable({
        holidays: [holiday]
      })

      cy.findByRole('button', { name: /edit/i })
        .click()
        .then(() => {
          expect(onEdit).toHaveBeenCalledWith(holiday)
        })
    })
  })

  context('mobile', () => {
    beforeEach(() => {
      // run these tests as if in a mobile browser
      // and ensure our responsive UI is correct
      cy.viewport('iphone-6')
    })

    it('[MOBILE] should show a message when vacation array is empty', () => {
      renderVacationTable({ holidays: [] })

      cy.findByText('There is no registered vacation period').should('exist')
    })

    it('[MOBILE] should show vacation requests', function() {
      const holidays = [
        {
          id: 1,
          days: [new Date('2020-03-10')],
          state: PrivateHolidayState.Accept,
          observations: undefined,
          userComment: undefined
        },
        {
          id: 2,
          days: [new Date('2020-01-10'), new Date('2020-01-15')],
          state: PrivateHolidayState.Cancelled,
          observations: '8 Dias',
          userComment: 'Me voy de viaje'
        },
        {
          id: 3,
          days: [new Date('2020-10-08'), new Date('2020-10-20')],
          state: PrivateHolidayState.Pending,
          observations: '7 Días',
          userComment: 'Quiero vacaciones'
        }
      ]
      renderVacationTable({ holidays: holidays })

      cy.get('.chakra-accordion > div').each(($row, index) => {
        const holiday = holidays[index]

        cy.wrap($row).within(() => {
          cy.contains(formatVacationPeriod(holiday.days))
          cy.contains(holiday.days.length.toString())
          cy.contains(holiday.state.toString(), { matchCase: false })

          // show the row content
          cy.root().click()

          cy.contains(holiday.userComment || '-').should('be.visible')
          cy.contains(holiday.observations || '-').should('be.visible')

          if (holiday.state === PrivateHolidayState.Pending) {
            cy.contains('button', 'Edit').should('be.visible')
            cy.contains('button', 'Remove').should('be.visible')
          }
        })
      })
    })

    it('[MOBILE] do NOT delete a vacation request when the user cancel the operation', () => {
      const { deleteVacationPeriod, onRefreshHolidays } = renderVacationTable({
        holidays: [
          {
            id: 3,
            days: [new Date('2020-10-08'), new Date('2020-10-20')],
            state: PrivateHolidayState.Pending,
            observations: '7 Días',
            userComment: 'Quiero vacaciones'
          }
        ]
      })

      // Deploy the vacation row
      cy.findByRole('button').click()

      // Open the alert dialog
      cy.findByRole('button', { name: /remove/i }).click()

      // Click on the cancel button
      cy.findByText('Remove vacation period')
        .parent()
        .within(() => {
          cy.findByRole('button', { name: /cancel/i })
            .click()
            .then(() => {
              expect(deleteVacationPeriod).not.toHaveBeenCalled()
              expect(onRefreshHolidays).not.toHaveBeenCalled()
            })
        })
    })

    it('[MOBILE] delete the vacation request when the user confirm the operation', () => {
      const holiday = {
        id: 3,
        days: [new Date('2020-10-08'), new Date('2020-10-20')],
        state: PrivateHolidayState.Pending,
        observations: '7 Días',
        userComment: 'Quiero vacaciones'
      }
      const { deleteVacationPeriod, onRefreshHolidays } = renderVacationTable({
        holidays: [holiday]
      })

      // Deploy the vacation row
      cy.findByRole('button').click()

      // Open the alert dialog
      cy.findByRole('button', { name: /remove/i }).click()

      // Click on the remove button
      cy.findByText('Remove vacation period')
        .parent()
        .within(() => {
          cy.findByRole('button', { name: /remove/i })
            .click()
            .then(() => {
              expect(deleteVacationPeriod).toHaveBeenCalledWith(holiday.id)
              expect(onRefreshHolidays).toHaveBeenCalled()
            })
        })
    })

    it('[MOBILE] edit the vacation request when the user click on the edit button', () => {
      const holiday = {
        id: 3,
        days: [new Date('2020-10-08'), new Date('2020-10-20')],
        state: PrivateHolidayState.Pending,
        observations: '7 Días',
        userComment: 'Quiero vacaciones'
      }
      const { onEdit } = renderVacationTable({
        holidays: [holiday]
      })

      // Deploy the vacation row
      cy.findByRole('button').click()

      cy.findByRole('button', { name: /edit/i })
        .click()
        .then(() => {
          expect(onEdit).toHaveBeenCalledWith(holiday)
        })
    })
  })
})

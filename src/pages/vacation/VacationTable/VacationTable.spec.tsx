import React from 'react'
import { render } from 'test-utils/app-test-utils'
import { VacationTable } from 'pages/vacation/VacationTable/VacationTable'
import { PrivateHolidayState } from 'api/interfaces/IHolidays'
import '@testing-library/cypress/add-commands'
import 'cypress-jest-adapter'

// Mobile | Desktop | Dark -> Base UI
// Snapshot with all three request states
// Snapshot with the modal open
// Snapshot with the accordion deployed on mobile

describe('Vacation Table', () => {
  function renderVacationTable({
    holidays = [],
    onRemove = cy.stub(),
    onEdit = cy.stub()
  }: any) {
    const holidaysReader = cy.stub().returns({
      privateHolidays: holidays
    })

    render(
      <VacationTable
        holidays={holidaysReader}
        onRemove={onRemove}
        onEdit={onEdit} />
    )

    return { holidays, onRemove, onEdit }
  }

  it('should show skeleton of desktop table', () => {
    const holidaysReader = cy.stub().throws(new Promise((resolve) => {}))

    render(
      <VacationTable
        holidays={holidaysReader}
        onRemove={cy.stub()}
        onEdit={cy.stub()}
      />
    )
  })

  it('should show a message when vacation array is empty', () => {
    renderVacationTable({ holidays: [] })

    cy.findByText('No tienes vacaciones').should('exist')
  })

  it('should show vacation requests', function() {
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
          .contains('StartDate - EndDate')
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
            .contains('button', 'Editar')
          cy.get('td')
            .eq(5)
            .contains('button', 'Eliminar')
        } else {
          cy.get('td')
            .eq(5)
            .should('be.empty')
        }
      })
    })
  })

  it('do NOT delete a vacation request when the user cancel the operation', () => {
    const { onRemove } = renderVacationTable({
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
    cy.findByRole('button', { name: 'Eliminar' }).click()

    // Click on the cancel button
    cy.findByText('Eliminar periodo de vacaciones')
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Cancelar' })
          .click()
          .then(() => {
            expect(onRemove).not.toHaveBeenCalled()
          })
      })
  })

  it('delete the vacation request when the user confirm the operation', () => {
    const holiday = {
      id: 3,
      days: [new Date('2020-10-08'), new Date('2020-10-20')],
      state: PrivateHolidayState.Pending,
      observations: '7 Días',
      userComment: 'Quiero vacaciones'
    }
    const { onRemove } = renderVacationTable({
      holidays: [holiday]
    })

    // Open the alert dialog
    cy.findByRole('button', { name: 'Eliminar' }).click()

    // Click on the remove button
    cy.findByText('Eliminar periodo de vacaciones')
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Eliminar' })
          .click()
          .then(() => {
            expect(onRemove).toHaveBeenCalledWith(holiday.id)
          })
      })
  })

  it('edit the vacation request when the user click on the edit button', () => {
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

    cy.findByRole('button', { name: 'Editar' })
      .click()
      .then(() => {
        expect(onEdit).toHaveBeenCalledWith(holiday)
      })
  })
})

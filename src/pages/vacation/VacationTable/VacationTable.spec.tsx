import React from 'react'
import { render } from 'test-utils/app-test-utils'
import { VacationTable } from 'pages/vacation/VacationTable/VacationTable'
import { PrivateHolidayState } from 'api/interfaces/IHolidays'
import '@testing-library/cypress/add-commands'

// Mobile | Desktop | Dark -> Base UI
// Snapshot with all three request states
// Snapshot with the modal open
// Snapshot with the accordion deployed on mobile

describe('Vacation Table', () => {
  // it.only('should show skeleton of desktop table', () => {
  //   const holidaysReader = cy.stub().throws(new Promise((resolve) => {}))
  //
  //   render(
  //     <VacationTable
  //       holidays={holidaysReader}
  //       onRemove={cy.stub()}
  //       onEdit={cy.stub()}
  //     />
  //   )
  // })
  it.only('should show vacation requests', function() {
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
    const holidaysReader = cy.stub().returns({
      privateHolidays: holidays
    })

    render(
      <VacationTable
        holidays={holidaysReader}
        onRemove={cy.stub()}
        onEdit={cy.stub()}
      />
    )

    cy.get('tbody > tr').each(($vacationRequestRow, index) => {
      const holiday = holidays[index]

      cy.wrap($vacationRequestRow).within(() => {
        cy.findByText(holiday.days.length.toString())
        cy.findByText(holiday.state.toString(), { exact: false })
        // cy.findByText(holiday.userComment)
      })
    })
  })
})

// it.todo('do not delete a vacation request when the user cancel the operation')
// it.todo('delete the vacation request when the user confirm the the operation')
// it.todo('edit the vacation request when the user click on the edit button')

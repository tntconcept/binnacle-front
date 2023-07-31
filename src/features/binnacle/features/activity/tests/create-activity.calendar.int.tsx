import CalendarDesktop from '../ui/calendar-desktop/calendar-desktop'
import { CalendarProvider } from '../ui/contexts/calendar-context'

describe('Create activity', () => {
  it('should create a new activity', () => {
    setup()
    cy.findByLabelText('8, Wednesday March 2023').click()
    cy.findByLabelText('Description').type('Hello world')
    cy.findByRole('button', { name: 'Save' }).click()

    cy.findByLabelText('09:00 - 13:00, Billable, Hello world').should('exist')
  })
})

function setup() {
  cy.mount(
    <CalendarProvider>
      <CalendarDesktop />
    </CalendarProvider>
  )
}

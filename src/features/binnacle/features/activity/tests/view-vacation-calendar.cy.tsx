import CalendarDesktop from '../ui/calendar-desktop/calendar-desktop'
import { CalendarProvider } from '../ui/contexts/calendar-context'

describe('View vacation in calendar', () => {
  it('should view holidays in calendar', () => {
    setup()
    cy.findByLabelText('10, Friday March 2023, Vacations').should('exist')
  })
})

function setup() {
  cy.mount(
    <CalendarProvider>
      <CalendarDesktop />
    </CalendarProvider>
  )
}

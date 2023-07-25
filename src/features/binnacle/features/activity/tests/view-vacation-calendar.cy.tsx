import CalendarDesktop from '../ui/calendar-desktop/calendar-desktop'
import { CalendarProvider } from '../ui/contexts/calendar-context'

describe('View vacation in calendar', () => {
  it('should view holidays in calendar', () => {
    setup()
    cy.findByLabelText('2, Thursday March 2023, Binnacle holiday').should('exist')
  })
})

function setup() {
  cy.mount(
    <CalendarProvider>
      <CalendarDesktop />
    </CalendarProvider>
  )
}

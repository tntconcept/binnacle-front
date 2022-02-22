class BinnacleDesktopPO {
  static openTodayActivityForm() {
    cy.get('[data-testid=today]').parent().click()

    // Wait for modal animation
    cy.wait(500)
  }

  static getPreparedActivity() {
    return cy.contains('09:00 - 13:00 Dashboard')
  }

  static checkTodayHoursQuantity(value: string) {
    cy.get('[data-testid=today]').parent().contains(value)

    return this
  }

  static checkTimeWorkedValue(value: string) {
    cy.get('[data-testid=time_worked_value]').should('contain', value)
    return this
  }

  static checkTimeTrackingHours(value: string) {
    cy.get('[data-testid=time_tracking_hours]').should('contain', value)
    return this
  }

  static clickPrevMonth() {
    cy.get('[data-testid=prev_month_button]').click()
    return this
  }

  static clickNextMonth() {
    cy.get('[data-testid=next_month_button]').click()
    return this
  }

  static clickYearAndMonth(year: string, month: string) {
    cy.get('[data-testid=selected_date]').click()
    cy.contains(year).trigger('click')
    cy.contains(new RegExp('^' + month + '$', 'g')).trigger('click')
    return this
  }
}

export default BinnacleDesktopPO

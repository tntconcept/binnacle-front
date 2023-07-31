export class BinnacleMobilePo {
  static swipeNextWeek() {
    cy.get('[data-testid=calendar_swipe]')
    cy.trigger('pointerdown', { which: 1, pageY: 97, pageX: 500 })
    cy.trigger('pointermove', 'right')
    cy.trigger('pointerup')
  }

  static swipePrevWeek() {
    cy.get('[data-testid=calendar_swipe]')
    cy.trigger('pointerdown', { which: 1, pageY: 97, pageX: -50 })
    cy.trigger('pointermove', 'left')
    cy.trigger('pointerup')
  }
}

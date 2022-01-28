class BinnacleMobilePO {
  static swipeNextWeek() {
    cy.get('[data-testid=calendar_swipe]')
      .trigger('pointerdown', { which: 1, pageY: 97, pageX: 500 })
      .trigger('pointermove', "right")
      .trigger('pointerup')
      .wait(200)
  }

  static swipePrevWeek() {
    cy.get('[data-testid=calendar_swipe]')
      .trigger('pointerdown', { which: 1, pageY: 97, pageX: -50 })
      .trigger('pointermove',  "left")
      .trigger('pointerup')
      .wait(200)
  }
}

export default BinnacleMobilePO;

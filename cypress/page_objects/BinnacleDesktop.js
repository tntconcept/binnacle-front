/// <reference types="cypress" />

class BinnacleDesktop {
  changeStartTime(value) {
    const field = cy.get('[data-testid=startTime]');
    field.clear();
    field.type(value);

    return this;
  }

  openTodayActivityForm() {
    cy.get("[data-testid=today]")
      .parent()
      .click();
  }

  checkTodayHoursQuantity(value) {
    cy.get("[data-testid=today]")
      .parent()
      .contains(value);
  }

  checkTimeBalanceValue(value) {
    cy.get("[data-testid=time_balance_value]").should("contain", value);
  }

  checkTimeWorkedValue(value) {
    cy.get("[data-testid=time_worked_value]").should("contain", value);
  }

  calculateTimeBalanceByYear() {
   // TODO
  }

  calculateTimeBalanceByMonth() {
    // TODO
  }


  changeMonth() {

  }

}

export default BinnacleDesktop;

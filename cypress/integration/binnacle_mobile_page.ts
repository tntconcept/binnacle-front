import LoginPO from "../page_objects/LoginPO"
import ActivityFormPO from "../page_objects/ActivityFormPO"
import BinnacleMobilePO from "../page_objects/BinnacleMobilePO"

context("Binnacle Mobile Page", () => {

  beforeEach(() => {
    cy.viewport("iphone-xr")
    cy.request('http://localhost:8080/db/seed')

    LoginPO.visit();
    LoginPO.login();
  });

  it("should loads page correctly", () => {
    cy.contains("Apr, Today").should("be.visible")

    cy.get('.is-today')
      .should("be.visible")
      .should("have.text", "10")
    cy.get('[data-testid=activity_card]')
      .should("be.visible")
      .contains("Billable").should("be.visible")
      .parent()
      .contains("09:00 - 13:00 (4h)").should("be.visible")
      .closest('[data-testid=activity_card]')
      .contains("Activity created for end-to-end tests")
  })

  it("should update an activity and update screen", () => {
    cy.get('[data-testid=activity_card]').click()

    ActivityFormPO
      .toggleBillableField()
      .submit();

    cy.get('[data-testid=activity_card]')
      .should("be.visible")
      .contains("Billable").should("not.exist")
  })

  it('should create an activity and update screen', function () {
    // TODO wait for requests or loading spinner to be hidden
    cy.get('[data-testid=add_activity]').click()

    ActivityFormPO
      .changeStartTime("14:00")
      .changeEndTime("18:00")
      .showSelectRoleSection()
      .selectRole({
        organization: "Empresa 2",
        project: "Dashboard",
        projectRole: "React"
      })
      .typeDescription("Description written by Cypress")
      .submit();

    cy.get('[data-testid=activity_card]')
      .should("have.length", 2)
      .eq(1)
      .should("be.visible")
      .contains("Billable").should("be.visible")
      .parent()
      .contains("14:00 - 18:00 (4h)").should("be.visible")
  })

  it("should fetch data when the month changes", () => {
    BinnacleMobilePO.swipePrevWeek()

    cy.get('.is-selected').should("have.text", "30")

    cy.contains("Mar, 30")
    cy.contains("-172h")
    cy.contains("176h")
  })

  it('should create on other day correctly', function () {
    BinnacleMobilePO.swipeNextWeek()

    cy
      .contains("Apr, Next Monday")
      .get('.is-selected').should("have.text", "13")
      .get("[data-testid=add_activity]").click()

    ActivityFormPO
      .changeStartTime("14:00")
      .changeEndTime("18:00")
      .showSelectRoleSection()
      .selectRole({
        organization: "Empresa 2",
        project: "Dashboard",
        projectRole: "React"
      })
      .typeDescription("Activity created on April 13")
      .submit();

    cy
      .contains("Apr, Next Monday")
      .get('.is-selected').should("have.text", "13")
      .get('[data-testid=activity_card]').should("be.visible")
      .contains("Activity created on April 13")

  })

  it('should show total time of activities by date', function () {
    cy.get("[data-testid=activities_time]")
      .contains("4h")
  })

  it.only('should be able to see holidays', function () {

  })

});

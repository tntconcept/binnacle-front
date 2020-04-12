import LoginPO from "../page_objects/LoginPO";
import ActivityFormPO from "../page_objects/ActivityFormPO";
import BinnacleDesktopPO from "../page_objects/BinnacleDesktopPO";

context.only("Binnacle Desktop Page", () => {
  beforeEach(() => {
    // 10 - Abril - 2020
    const date = new Date(2020, 4 - 1, 10).getTime();
    cy.clock(date, ['Date'])

    cy.request('http://localhost:8080/db/seed')
    LoginPO.visit();
    LoginPO.login();
  });

  it("should update time stats when an activity is created", () => {
    cy.server();
    cy.route("POST", "api/activities").as("createActivity");

    BinnacleDesktopPO.openTodayActivityForm();

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
      .uploadImg("cy.png")
      .submit();

    cy.wait("@createActivity");

    BinnacleDesktopPO
      .checkTodayHoursQuantity("8h")
      .checkTimeWorkedValue("12h")
      .checkTimeToWorkValue("168h")
      .checkTimeBalanceValue("-156h")

    cy.contains("14:00 - 18:00 Dashboard").should("be.visible")
  });

  it("should update time stats when an activity is removed", function() {
    cy.server();
    cy.route("DELETE", "api/activities/*").as("deleteActivity");

    cy.contains("09:00 - 13:00 Dashboard").click();

    ActivityFormPO.remove();

    cy.wait("@deleteActivity");

    BinnacleDesktopPO
      .checkTimeWorkedValue("4h")
      .checkTimeToWorkValue("168h")
      .checkTimeBalanceValue("-164h")

  });

  it("should update time stats when an activity is edited", function() {
    cy.server();
    cy.route("PUT", "api/activities").as("updateActivity");

    cy.contains("09:00 - 13:00 Dashboard").click();

    ActivityFormPO
      .changeEndTime("16:00")
      .toggleBillableField()
      .typeDescription("Editing an activity")
      .submit();

    cy.wait("@updateActivity");

    cy.contains("09:00 - 16:00 Dashboard").should("be.visible");

    BinnacleDesktopPO
      .checkTimeWorkedValue("11h")
      .checkTimeToWorkValue("168h")
      .checkTimeBalanceValue("-157h")
      .checkTodayHoursQuantity("7h")
  });

  it('should be able to see holidays', function () {
    // Public holidays
    cy.contains("Public Holiday Testing").should("be.visible");

    // Compensation days
    cy.contains("Compensation Day Testing").should("be.visible");

    // Private holidays
    cy.contains("Vacaciones").should("be.visible");
  });

  it('should not show recent roles list when the new activity is not in the past 30 days', function () {
    BinnacleDesktopPO.clickPrevMonth();
    BinnacleDesktopPO
      .checkTimeWorkedValue("4h")
      .checkTimeToWorkValue("176h")
      .checkTimeBalanceValue("-172h");

    cy.contains("31").click()

    cy.contains("Recent roles").should("be.visible")

    cy.get('body').type("{esc}")

    cy.contains("24").click()

    cy.contains("Select role").should("be.visible")
  });

  it('should calculate time by year', function () {
    cy.get('[data-testid=select]').select('Year balance');
    BinnacleDesktopPO
      .checkTimeWorkedValue("12h")
      .checkTimeToWorkValue("552h")
      .checkTimeBalanceValue("-540h");
  });

  it('should show time balance only if the user selects a previous month or current month is selected', function () {
    // Prev month should hide select
    BinnacleDesktopPO.clickPrevMonth()
    cy.get('[data-testid=select]').should("be.visible")
    cy.contains("Month balance").should("be.visible")

    // Current month should show select
    BinnacleDesktopPO.clickNextMonth()
    cy.get('[data-testid=select]').should("be.visible")

    // Next month should hide time balance section
    BinnacleDesktopPO.clickNextMonth()
    cy.get('[data-testid=select]').should("not.be.visible")
    cy.contains("Month balance").should("not.be.visible")
  });
});

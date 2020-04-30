import LoginPO from "../page_objects/LoginPO"
import SettingsPO from "../page_objects/SettingsPO"
import BinnacleDesktopPO from "../page_objects/BinnacleDesktopPO"
import ActivityFormPO from "../page_objects/ActivityFormPO"

context("Settings page", () => {
  beforeEach(() => {
    LoginPO.visit();
    LoginPO.login();

    cy.contains("Settings").click();
  });

  it("should modify autofill hours", function() {
    cy.request("http://localhost:8080/db/clear");

    SettingsPO.changeStartWorkingTime("10:00");
    SettingsPO.changeEndWorkingTime("19:00");
    SettingsPO.changeStartLunchBreak("14:00");
    SettingsPO.changeEndLunchBreak("15:00");

    cy.contains("Binnacle").click();

    BinnacleDesktopPO.openTodayActivityForm();

    cy.get("[data-testid=startTime]").should("have.value", "10:00");
    cy.get("[data-testid=endTime]").should("have.value", "14:00");

    ActivityFormPO
      .selectRole({
        organization: "Autentia",
        project: "TNT",
        projectRole: "Back-End"
      })
      .typeDescription("lorem ipsum...")
      .submit();

    BinnacleDesktopPO.openTodayActivityForm();
    cy.get("[data-testid=startTime]").should("have.value", "15:00");
    cy.get("[data-testid=endTime]").should("have.value", "19:00");

    cy.request("http://localhost:8080/db/clear");
  });

  it('should show an error when hours are overlapping', function () {
    SettingsPO.changeStartWorkingTime("15:00")
    cy.contains('Intervals are overlapping').should('be.visible')
  });

  it("should not autofill hours", function() {
    // By default auto-fill hours is enabled, so we disable it
    SettingsPO.toggleAutoFillHours();

    cy.contains("Binnacle").click();

    BinnacleDesktopPO.openTodayActivityForm()

    cy.get("[data-testid=startTime]").should("contain.value", "16");
    cy.get("[data-testid=endTime]").should("contain.value", "17");
  });

  it("should hide sunday", function() {
    // By default saturday is shown, so we hide it
    SettingsPO.toggleHideSaturday();

    cy.contains("Binnacle").click();
    cy.contains("sat/sun").should("not.exist")
    cy.contains("sun").should("be.visible")
  });

  it("should hide sunday", function() {
    // By default sunday is shown, so we hide it
    SettingsPO.toggleHideSunday();

    cy.contains("Binnacle").click();
    cy.contains("sat/sun").should("not.exist")
    cy.contains("sat").should("be.visible")
  });

  it("should show duration input in the activity form", function() {
    // By default duration input is hidden, so we show it
    SettingsPO.toggleShowDurationInput();

    cy.contains("Binnacle").click();
    BinnacleDesktopPO.openTodayActivityForm()

    cy.get('[data-testid=duration]').should('be.visible')
  });

  it("should use decimal format to format time", function() {
    cy.request("http://localhost:8080/db/clear");

    // By default decimal format is disabled, so we enable it
    SettingsPO.toggleDecimalFormat();

    cy.contains("Binnacle").click();

    BinnacleDesktopPO.openTodayActivityForm()

    ActivityFormPO.changeEndTime("13:15")

    cy.contains("4.25").should('be.visible')

    ActivityFormPO
      .selectRole({
        organization: "Autentia",
        project: "TNT",
        projectRole: "Back-End"
      })
      .typeDescription("lorem ipsum...")
      .submit();

    BinnacleDesktopPO.checkTodayHoursQuantity("4.25")
    BinnacleDesktopPO.checkTimeWorkedValue("4.25")
    BinnacleDesktopPO.checkTimeToWorkValue("176")
    BinnacleDesktopPO.checkTimeBalanceValue("-59.75")

    cy.request("http://localhost:8080/db/clear");
  });
});

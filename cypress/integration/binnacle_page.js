import LoginPage from "../page_objects/LoginPage";
import ActivityForm from "../page_objects/ActivityForm";
import BinnacleDesktop from "../page_objects/BinnacleDesktop";

context("Login page", () => {
  beforeEach(() => {
    const loginPage = new LoginPage();
    loginPage.visit();
    loginPage.login();
  });

  it("should create activity selecting the role", () => {
    cy.server();
    cy.route("POST", "api/activities").as("createActivity");

    const binnacleDesktop = new BinnacleDesktop();
    binnacleDesktop.openTodayActivityForm();

    const activityForm = new ActivityForm();

    activityForm
      .changeStartTime("10:00")
      .changeEndTime("14:00")
      .showSelectRoleSection()
      .addRole({
        organization: "Empresa 2",
        project: "Dashboard",
        projectRole: "React"
      })
      .typeDescription("Description written by Cypress")
      .uploadImg("cy.png")
      .submit();

    cy.wait("@createActivity");

    binnacleDesktop.checkTodayHoursQuantity("4h");
    binnacleDesktop.checkTimeBalanceValue("-144h");
    binnacleDesktop.checkTimeWorkedValue("32h");

    activityForm.remove();
  });


  const createActivity = () => {
    const activityForm = new ActivityForm();
    activityForm
      .changeStartTime("09:30")
      .changeEndTime("13:30")
      .clickRecentRole("React")
      .typeDescription("Creating an activity to test")
      .uploadImg("cy.png")
      .submit();
  };

  it("should show a notification when create activity request fails", function() {
    cy.server();
    cy.route({
      method: "POST",
      url: "api/activities",
      status: 408,
      response: {}
    }).as("createActivity");

    const binnacleDesktop = new BinnacleDesktop();
    binnacleDesktop.openTodayActivityForm();

    createActivity();

    cy.wait("@createActivity");

    cy.contains("Cannot connect to server").should("be.visible");
    cy.get("[data-testid=modal]").should("be.visible");
  });

  it("should create activity sucessfully when the user does not have recent roles", function() {
    cy.server();
    cy.route({
      method: "GET",
      url: "api/projectRoles/recents",
      status: 200,
      response: []
    });
    cy.route("POST", "api/activities").as("createActivity");

    cy.get("[data-testid=today]")
      .parent()
      .click();

    const activityForm = new ActivityForm();

    activityForm
      .changeStartTime("09:30")
      .changeEndTime("13:30")
      .addRole({
        organization: "Empresa 2",
        project: "Dashboard",
        projectRole: "React"
      })
      .typeDescription("Description written by Cypress")
      .uploadImg("cy.png")
      .submit();

    cy.wait("@createActivity");

    cy.get("[data-testid=today]")
      .parent()
      .parent()
      .contains("09:30 - 13:30 Dashboard")
      .click();

    activityForm.remove();
  });

  it("should create activity using recent role list", function() {
    cy.server();
    cy.route("POST", "api/activities").as("createActivity");

    cy.get("[data-testid=today]")
      .parent()
      .click();

    const activityForm = new ActivityForm();
    activityForm
      .changeStartTime("09:30")
      .changeEndTime("13:30")
      .clickRecentRole("React")
      .typeDescription("Creating an activity using recent roles")
      .uploadImg("cy.png")
      .submit();

    cy.wait("@createActivity");

    cy.get("[data-testid=today]")
      .parent()
      .parent()
      .contains("09:30 - 13:30 Dashboard")
      .click();

    activityForm.remove();
  });

  it("should delete an activity", function() {
    cy.server();
    cy.route("DELETE", "api/activities/*").as("deleteActivity");

    cy.get("[data-testid=today]")
      .parent()
      .click();

    createActivity()

    cy.get("[data-testid=today]")
      .parent()
      .parent()
      .contains("09:30 - 13:30 Dashboard")
      .click();

    new ActivityForm().remove();

    cy.wait("@deleteActivity");
  });

  it("should show a notification if delete request fails", function() {
    cy.server();
    cy.route({
      method: "DELETE",
      url: "api/activities/*",
      status: 408,
      response: {}
    });

    cy.get("[data-testid=today]")
      .parent()
      .click();

    createActivity();

    cy.get("[data-testid=today]")
      .parent()
      .parent()
      .contains("09:30 - 13:30 Dashboard")
      .click();

    new ActivityForm().remove();

    cy.contains("Cannot connect to server").should("be.visible");
    cy.get("[data-testid=modal]").should("be.visible");
  });

  it("should edit an activity", function() {
    cy.server();
    cy.route("PUT", "api/activities").as("updateActivity");

    cy.get("[data-testid=today]")
      .parent()
      .click();

    createActivity()

    cy.get("[data-testid=today]")
      .parent()
      .parent()
      .contains("09:30 - 13:30 Dashboard")
      .click();

    const activityForm = new ActivityForm();

    activityForm
      .changeEndTime("16:00")
      .toggleBillableField()
      .typeDescription("Editing an activity")
      .submit();

    cy.wait("@updateActivity");

    cy.get("[data-testid=today]")
      .parent()
      .parent()
      .contains("09:30 - 16:00 Dashboard")
      .click();

    activityForm.remove();
  });

  it("should show a notification if update request fails", function() {
    cy.server();
    cy.route({
      method: "PUT",
      url: "api/activities",
      status: 408,
      response: {}
    });

    cy.get("[data-testid=today]")
      .parent()
      .click();

    createActivity()

    cy.get("[data-testid=today]")
      .parent()
      .parent()
      .contains("09:30 - 13:30 Dashboard")
      .click();

    const activityForm = new ActivityForm();

    activityForm
      .changeEndTime("16:00")
      .toggleBillableField()
      .typeDescription("Editing an activity")
      .submit();

    cy.contains("Cannot connect to server").should("be.visible");
    cy.get("[data-testid=modal]").should("be.visible");
  });

  it('should open and delete image', function () {
    cy.server();
    cy.route('GET', 'api/activities/*/image').as("downloadImg");

    cy.get("[data-testid=today]")
      .parent()
      .click();

    createActivity()

    cy.get("[data-testid=today]")
      .parent()
      .parent()
      .contains("09:30 - 13:30 Dashboard")
      .click();

    const activityForm = new ActivityForm();
    activityForm.openImg();

    cy.wait("@downloadImg")

    cy.window().its('open').should('be.called');

    activityForm.deleteImg()

    cy.get('[data-testid=open-image]').should('not.be.visible');
    cy.get('[data-testid=delete-image]').should('not.be.visible');

    activityForm.remove()
  });

  it('should show notification when get image request fails', function () {
    cy.server();
    cy.route({
      method: "GET",
      url: 'api/activities/*/image',
      status: 408,
      response: {}
    });

    cy.get("[data-testid=today]")
      .parent()
      .click();

    createActivity()

    cy.get("[data-testid=today]")
      .parent()
      .parent()
      .contains("09:30 - 13:30 Dashboard")
      .click();

    const activityForm = new ActivityForm();
    activityForm.openImg();

    cy.contains("Cannot connect to server").should("be.visible");
    cy.get("[data-testid=modal]").should("be.visible");
  });
});

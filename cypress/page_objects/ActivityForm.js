/// <reference types="cypress" />

class ActivityForm {
  changeStartTime(value) {
    const field = cy.get('[data-testid=startTime]');
    field.clear();
    field.type(value);

    return this;
  }

  changeEndTime(value) {
    const field = cy.get('[data-testid=endTime]');
    field.clear();
    field.type(value);

    return this;
  }

  showSelectRoleSection() {
    cy.contains("+ Add role").click();
    return this
  }

  clickRecentRole(value) {
    cy.contains(value).click();
    return this
  }

  hideSelectRoleSection() {
    cy.contains("Back to recent roles").click();
    return this
  }

  addRole(values) {
    cy.get('[data-testid=organization_combobox]').clear().type(values.organization).type("{enter}");
    cy.get('[data-testid=project_combobox]').clear().type(values.project).type("{enter}");
    cy.get('[data-testid=role_combobox]').clear().type(values.projectRole).type("{enter}");
    return this
  }

  toggleBillableField() {
    cy.get('[data-testid=billable_checkbox]').click({force: true});
    return this
  }

  typeDescription(value) {
    const field = cy.get(`[data-testid=description]`);
    field.clear();
    field.type(value);

    return this;
  }

  uploadImg(fixture) {
    cy.get(`[data-testid="upload_img"]`).attachFile(fixture);
    return this
  }

  openImg() {
    cy.get('[data-testid=open-image]').click()
  }

  deleteImg() {
    cy.get('[data-testid=delete-image]').click()
  }

  remove() {
    cy.get('[data-testid=remove_activity]').click();
    cy.get('[data-testid=yes_modal_button]').click();
  }

  submit() {
    const submitButton = cy.get('[data-testid=save_activity]')
    submitButton.click();
  }
}

export default ActivityForm;

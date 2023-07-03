export class ActivityFormPO {
  static changeStartTime(value: string) {
    cy.findByLabelText('Start time').clear().type(value)

    return this
  }

  static changeEndTime(value: string) {
    cy.findByLabelText('End time').clear().type(value)

    return this
  }

  static changeDurationInput(value: string) {
    cy.get('[data-testid=duration]').clear().type(value)

    return this
  }

  static showSelectRoleSection() {
    cy.contains('Add role').click()
    return this
  }

  static clickRecentRole(value: string) {
    cy.contains(value).click()
    return this
  }

  static hideSelectRoleSection() {
    cy.contains('Back to recent roles').click()
    return this
  }

  static selectRole(values: { organization: string; project: string; projectRole: string }) {
    cy.findAllByLabelText('Organization').first().clear().type(values.organization)
    cy.contains('[role=listbox]', values.organization).click()

    cy.findAllByLabelText('Project').first().clear().type(values.project)
    cy.contains('[role=listbox]', values.project).click()

    cy.findAllByLabelText('Role').first().clear().type(values.projectRole)
    cy.contains('[role=listbox]', values.projectRole).click({ force: true })
    // cy.wait(500)
    return this
  }

  static toggleBillableField() {
    cy.findByLabelText('Billable').click({ force: true })
    return this
  }

  static typeDescription(value: string) {
    cy.findByLabelText('Description').clear().type(value)

    return this
  }

  static uploadImg(fixture: string) {
    cy.get(`[data-testid="upload_img"]`).attachFile(fixture)

    return this
  }

  static openImg() {
    cy.get('[data-testid=open-image]').click()
  }

  static deleteImg() {
    cy.get('[data-testid=delete-image]').click()
    return this
  }

  static remove() {
    cy.get('[data-testid=remove_activity]').click()
    cy.contains('Remove activity').click()
  }

  static submit() {
    cy.contains('Save').click()
  }
}

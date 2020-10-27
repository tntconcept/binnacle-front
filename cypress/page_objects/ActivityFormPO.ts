class ActivityFormPO {
  static changeStartTime(value: string) {
    const field = cy.findByLabelText('Start time')
    field.clear()
    field.type(value)

    return this
  }

  static changeEndTime(value: string) {
    const field = cy.findByLabelText('End time')
    field.clear()
    field.type(value)

    return this
  }

  static changeDurationInput(value: string) {
    const field = cy.get('[data-testid=duration]')
    field.clear()
    field.type(value)

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
    cy.findByLabelText('Organization')
      .clear()
      .type(values.organization)
    cy.contains('[role=listbox]', values.organization).click()

    cy.findByLabelText('Project')
      .clear()
      .type(values.project)
    cy.contains('[role=listbox]', values.project).click()

    cy.findByLabelText('Role')
      .clear()
      .type(values.projectRole)
    cy.contains('[role=listbox]', values.projectRole).click()

    return this
  }

  static toggleBillableField() {
    cy.findByLabelText('Billable').click({ force: true })
    return this
  }

  static typeDescription(value: string) {
    const field = cy.findByLabelText('Description')
    field.clear()
    field.type(value)

    return this
  }

  static uploadImg(fixture: string) {
    // @ts-ignore
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
    const submitButton = cy.get('[data-testid=save_activity]')
    submitButton.click()
  }
}

export default ActivityFormPO

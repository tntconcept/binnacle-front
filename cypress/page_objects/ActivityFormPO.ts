class ActivityFormPO {
  static changeStartTime(value: string) {
    const field = cy.get('[data-testid=startTime]')
    field.clear()
    field.type(value)

    return this
  }

  static changeEndTime(value: string) {
    const field = cy.get('[data-testid=endTime]')
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

  static selectRole(values: {
    organization: string
    project: string
    projectRole: string
  }) {
    cy.get('[data-testid=organization_combobox]')
      .clear()
      .type(values.organization)
      .type('{enter}')
    cy.get('[data-testid=project_combobox]')
      .clear()
      .type(values.project)
      .type('{enter}')
    cy.get('[data-testid=role_combobox]')
      .clear()
      .type(values.projectRole)
      .type('{enter}')
    return this
  }

  static toggleBillableField() {
    cy.get('[data-testid=billable_checkbox]').click({ force: true })
    return this
  }

  static typeDescription(value: string) {
    const field = cy.get(`[data-testid=description]`)
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
    cy.get('[data-testid=yes_modal_button]').click()
  }

  static submit() {
    const submitButton = cy.get('[data-testid=save_activity]')
    submitButton.click()
  }
}

export default ActivityFormPO

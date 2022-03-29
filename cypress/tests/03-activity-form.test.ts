import ActivityFormPO from '../page-objects/ActivityFormPO'
import BinnacleDesktopPO from '../page-objects/BinnacleDesktopPO'

describe('Activity Form', () => {
  const today = new Date()

  beforeEach(() => {
    cy.resetDatabase()
    cy.smartLoginTo('binnacle')

    window.localStorage.setItem(
      'binnacle_settings',
      JSON.stringify({
        isSystemTheme: true,
        autofillHours: true,
        hoursInterval: {
          startWorkingTime: '09:00',
          startLunchBreak: '13:00',
          endLunchBreak: '14:00',
          endWorkingTime: '18:00'
        },
        showDurationInput: false,
        useDecimalTimeFormat: false,
        showDescription: false
      })
    )
  })

  it('should create activity successfully when the user does not have recent roles', function () {
    cy.clock(today, ['Date'])
    cy.intercept('api/project-roles/recents', {
      statusCode: 200,
      body: []
    })
    cy.intercept('POST', 'api/activities').as('createActivity')
    today.setHours(22, 0, 0, 0)
    const todayISOString = today.toISOString()

    BinnacleDesktopPO.openTodayActivityForm()

    ActivityFormPO.changeStartTime('20:00')
      .changeEndTime('22:00')
      .selectRole({
        organization: 'Empresa 2',
        project: 'Dashboard',
        projectRole: 'React'
      })
      .typeDescription('Description written by Cypress')
      .submit()

    cy.wait('@createActivity').should((xhr) => {
      expect(xhr.response!.statusCode).to.equal(200)
      expect(xhr.request.body).to.deep.equal({
        billable: true,
        description: 'Description written by Cypress',
        duration: 120,
        hasImage: false,
        projectRoleId: 2,
        startDate: todayISOString
      })
    })

    cy.contains('20:00 - 22:00 Description written by Cypress').should('be.visible')
  })

  it('should create activity using recent role list and update time stats', function () {
    cy.clock(today, ['Date'])
    cy.intercept('POST', 'api/activities').as('createActivity')

    BinnacleDesktopPO.openTodayActivityForm()

    ActivityFormPO.changeStartTime('18:00')
      .changeEndTime('18:30')
      .clickRecentRole('React')
      .typeDescription('Creating an activity using recent roles')
      .uploadImg('cy.png')
      .submit()

    cy.wait('@createActivity').should((xhr) => {
      expect(xhr.response!.statusCode).to.equal(200)
    })

    cy.contains('18:00 - 18:30 Creating an activity using recent roles').should('be.visible')

    BinnacleDesktopPO.checkTodayHoursQuantity('1h 30m').checkTimeWorkedValue('5h 30m')
  })

  it('should show a notification when the activity time overlaps', function () {
    cy.clock(today, ['Date'])
    cy.intercept('POST', 'api/activities').as('createActivity')

    BinnacleDesktopPO.openTodayActivityForm()

    ActivityFormPO.changeStartTime('09:00')
      .changeEndTime('13:00')
      .typeDescription('Lorem ipsum...')
      .submit()

    cy.wait('@createActivity')

    cy.get('.chakra-toast').within(() => {
      cy.contains('The hours overlap').should('be.visible')
      cy.contains('There is already an activity in the indicated period of time').should(
        'be.visible'
      )
    })

    cy.findByRole('dialog').should('be.visible')
  })

  it("should show a notification when the activity's project is closed", function () {
    cy.clock(today, ['Date'])
    cy.intercept('POST', 'api/activities', {
      statusCode: 400,
      body: {
        code: 'CLOSED_PROJECT',
        status: 400,
        message: 'Lorem ipsum...'
      }
    }).as('createActivity')

    BinnacleDesktopPO.openTodayActivityForm()

    ActivityFormPO.typeDescription('Lorem ipsum...').submit()

    cy.wait('@createActivity')

    cy.get('.chakra-toast').within(() => {
      cy.contains('The project is closed').should('be.visible')
      cy.contains('Cannot register an activity with closed project').should('be.visible')
    })

    cy.findByRole('dialog').should('be.visible')
  })

  it('should delete an activity and update time stats', function () {
    cy.clock(today, ['Date'])
    cy.intercept('DELETE', 'api/activities/*').as('deleteActivity')

    cy.contains('10:00 - 11:00 Activity created for end-to-end tests').click()

    ActivityFormPO.remove()

    cy.wait('@deleteActivity').should((xhr) => {
      expect(xhr.response!.statusCode).to.equal(202)
    })

    BinnacleDesktopPO.checkTodayHoursQuantity('1h').checkTimeWorkedValue('4h')
  })

  it('should update an activity and update time stats', function () {
    cy.clock(today, ['Date'])
    cy.intercept('PUT', 'api/activities').as('updateActivity')
    today.setHours(12, 0, 0, 0)
    const todayISOString = today.toISOString()

    cy.contains('10:00 - 11:00 Activity created for end-to-end tests').click()

    ActivityFormPO.changeEndTime('12:00')
      .toggleBillableField()
      .typeDescription('Editing an activity')
      .submit()

    cy.wait('@updateActivity').should((xhr) => {
      expect(xhr.response!.statusCode).to.equal(200)

      const originalBody = { ...xhr.request.body }
      originalBody.id = 1

      expect(originalBody).to.deep.equal({
        billable: false,
        description: 'Editing an activity',
        duration: 120,
        hasImage: false,
        id: 1,
        projectRoleId: 2,
        startDate: todayISOString
      })
    })

    cy.contains('10:00 - 12:00 Editing an activity')

    BinnacleDesktopPO.checkTodayHoursQuantity('2h').checkTimeWorkedValue('6h')
  })

  it('should open and delete image', function () {
    cy.clock(today, ['Date'])
    cy.intercept('PUT', 'api/activities').as('updateActivity')
    cy.intercept('GET', 'api/activities/*/image').as('downloadImg')
    cy.intercept('DELETE', 'api/activities/*/image').as('deleteImg')

    cy.contains('10:00 - 11:00 Activity created for end-to-end tests').click()

    // First delete current image
    cy.get('[data-testid=delete-image]').click()

    ActivityFormPO.changeEndTime('13:30').uploadImg('cy.png')

    ActivityFormPO.submit()

    cy.wait('@updateActivity')

    cy.contains('10:00 - 13:30 Activity created for end-to-end tests').click()

    ActivityFormPO.openImg()

    cy.wait('@downloadImg')

    cy.window().its('open').should('be.called')

    ActivityFormPO.deleteImg()

    cy.findByLabelText('Open image').should('not.exist')
    cy.findByLabelText('Delete image').should('not.exist')

    ActivityFormPO.submit()

    cy.wait('@updateActivity')
  })
})

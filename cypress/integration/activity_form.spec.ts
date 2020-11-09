import ActivityFormPO from '../page_objects/ActivityFormPO'
import BinnacleDesktopPO from '../page_objects/BinnacleDesktopPO'
import SettingsPO from '../page_objects/SettingsPO'

describe('Activity Form', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.smartLoginTo('binnacle')

    window.localStorage.setItem(
      'binnacle_settings',
      JSON.stringify({
        theme: 'light',
        autofillHours: true,
        hoursInterval: ['09:00', '13:00', '14:00', '18:00'],
        showDurationInput: false,
        useDecimalTimeFormat: false,
        // changes the showDescription to false...
        showDescription: false
      })
    )
  })

  it('should create activity sucessfully when the user does not have recent roles', function() {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'api/project-roles/recents',
      status: 200,
      response: []
    })
    cy.route('POST', 'api/activities').as('createActivity')

    BinnacleDesktopPO.openTodayActivityForm()

    ActivityFormPO.changeStartTime('20:00')
      .changeEndTime('22:00')
      .selectRole({
        organization: 'Empresa 2',
        project: 'Dashboard',
        projectRole: 'React'
      })
      .typeDescription('Description written by Cypress')
      .uploadImg('cy.png')
      .submit()

    cy.wait('@createActivity').should((xhr) => {
      expect(xhr.status).to.equal(200)
      expect(xhr.request.body).to.deep.equal({
        billable: true,
        description: 'Description written by Cypress',
        duration: 120,
        hasImage: false,
        projectRoleId: 2,
        startDate: '2020-04-10T20:00:00.000Z'
      })
    })

    cy.contains('20:00 - 22:00 Project: Dashboard').should('be.visible')
  })

  it('should create activity using recent role list and update time stats', function() {
    cy.server()
    cy.route('POST', 'api/activities').as('createActivity')

    BinnacleDesktopPO.openTodayActivityForm()

    ActivityFormPO.changeStartTime('18:00')
      .changeEndTime('18:30')
      .clickRecentRole('React')
      .typeDescription('Creating an activity using recent roles')
      .uploadImg('cy.png')
      .submit()

    cy.wait('@createActivity').should((xhr) => {
      expect(xhr.status).to.equal(200)
    })

    cy.contains('18:00 - 18:30 Project: Dashboard').should('be.visible')

    BinnacleDesktopPO.checkTodayHoursQuantity('8h 30m')
      .checkTimeWorkedValue('8h 30m')
      .checkTimeToWorkValue('152h')
      .checkTimeBalanceValue('-31h 30m')
  })

  it('should show a notification error when create activity request fails', function() {
    cy.server()
    cy.route({
      method: 'POST',
      url: 'api/activities',
      status: 408,
      response: {}
    }).as('createActivity')

    BinnacleDesktopPO.openTodayActivityForm()

    ActivityFormPO.changeStartTime('09:30')
      .changeEndTime('13:30')
      .clickRecentRole('React')
      .typeDescription('Creating an activity to test')
      .uploadImg('cy.png')
      .submit()

    cy.wait('@createActivity')

    cy.contains('Cannot connect to server').should('be.visible')
    cy.get('[class^="chakra-modal"]').should('be.visible')
  })

  it('should show a notification when the activity time overlaps', function() {
    cy.server()
    cy.route('POST', 'api/activities').as('createActivity')

    BinnacleDesktopPO.openTodayActivityForm()

    // The user can not register an activity time period that is already registered
    ActivityFormPO.changeStartTime('09:00')
      .changeEndTime('13:00')
      .typeDescription('Lorem ipsum...')
      .submit()

    cy.wait('@createActivity')

    cy.contains('The hours overlap').should('be.visible')
    cy.contains('There is already an activity in the indicated period of time').should('be.visible')
    cy.get('[class^="chakra-modal"]').should('be.visible')
  })

  it('should parse the request error response when the project was closed', function() {
    cy.server()
    cy.route({
      method: 'POST',
      url: 'api/activities',
      status: 400,
      response: {
        code: 'CLOSED_PROJECT',
        status: 400,
        message: 'Lorem ipsum...'
      }
    }).as('createActivity')

    BinnacleDesktopPO.openTodayActivityForm()

    // I don't care about the data, because the request is mocked
    ActivityFormPO.typeDescription('Lorem ipsum...').submit()

    cy.wait('@createActivity')

    cy.contains('The project is closed').should('be.visible')
    cy.contains('Cannot register activity with closed project').should('be.visible')
    cy.get('[class^="chakra-modal"]').should('be.visible')
  })

  it('should delete an activity and update time stats', function() {
    cy.server()
    cy.route('DELETE', 'api/activities/*').as('deleteActivity')

    cy.contains('09:00 - 13:00 Project: Dashboard').click()

    ActivityFormPO.remove()

    cy.wait('@deleteActivity').should((xhr) => {
      expect(xhr.status).to.equal(202)
    })

    BinnacleDesktopPO.checkTodayHoursQuantity('4h')
      .checkTimeWorkedValue('4h')
      .checkTimeToWorkValue('152h')
      .checkTimeBalanceValue('-36h')
  })

  it('should show a notification error if delete request fails', function() {
    cy.server()
    cy.route({
      method: 'DELETE',
      url: 'api/activities/*',
      status: 408,
      response: {}
    })

    cy.contains('09:00 - 13:00 Project: Dashboard').click()

    ActivityFormPO.remove()

    cy.contains('Cannot connect to server').should('be.visible')

    cy.contains('Cancel').click()
    cy.get('[class^="chakra-modal"]').should('be.visible')
  })

  it('should update an activity and update time stats', function() {
    cy.server()
    cy.route('PUT', 'api/activities').as('updateActivity')

    cy.contains('09:00 - 13:00 Project: Dashboard').click()

    ActivityFormPO.changeEndTime('12:00')
      .toggleBillableField()
      .typeDescription('Editing an activity')
      .submit()

    cy.wait('@updateActivity').should((xhr) => {
      expect(xhr.status).to.equal(200)

      // Workaround to get always the same id
      // @ts-ignore
      const originalBody = { ...xhr.request.body }
      originalBody.id = 1

      expect(originalBody).to.deep.equal({
        billable: false,
        description: 'Editing an activity',
        duration: 180,
        hasImage: false,
        id: 1,
        projectRoleId: 2,
        startDate: '2020-04-10T09:00:00.000Z'
      })
    })

    cy.contains('09:00 - 12:00 Project: Dashboard')

    BinnacleDesktopPO.checkTodayHoursQuantity('7h')
      .checkTimeWorkedValue('7h')
      .checkTimeToWorkValue('152h')
      .checkTimeBalanceValue('-33h')
  })

  it('should show notification error if update request fails', function() {
    cy.server()
    cy.route({
      method: 'PUT',
      url: 'api/activities',
      status: 408,
      response: {}
    })

    cy.contains('09:00 - 13:00 Project: Dashboard').click()

    ActivityFormPO.changeEndTime('16:00')
      .toggleBillableField()
      .typeDescription('Editing an activity')
      .submit()

    cy.contains('Cannot connect to server').should('be.visible')
    cy.get('[class^="chakra-modal"]').should('be.visible')
  })

  it('should open and delete image', function() {
    cy.server()
    cy.route('PUT', 'api/activities').as('updateActivity')
    cy.route('GET', 'api/activities/*/image').as('downloadImg')
    cy.route('DELETE', 'api/activities/*/image').as('deleteImg')

    cy.contains('09:00 - 13:00 Project: Dashboard').click()

    ActivityFormPO.changeEndTime('13:30').uploadImg('cy.png')

    cy.wait(200)
    ActivityFormPO.submit()

    cy.wait('@updateActivity')

    cy.contains('09:00 - 13:30 Project: Dashboard').click()

    ActivityFormPO.openImg()

    cy.wait('@downloadImg')

    cy.window()
      .its('open')
      .should('be.called')

    ActivityFormPO.deleteImg()

    cy.get('[data-testid=open-image]').should('not.be.visible')
    cy.get('[data-testid=delete-image]').should('not.be.visible')

    ActivityFormPO.submit()

    cy.wait('@updateActivity')
  })

  it('should show notification error when get image request fails', function() {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'api/activities/*/image',
      status: 408,
      response: {}
    })

    cy.contains('09:00 - 13:00 Project: Dashboard').click()

    ActivityFormPO.changeEndTime('12:30').uploadImg('cy.png')

    // I don't know why sometimes the activity image is not saved
    cy.wait(500)
    ActivityFormPO.submit()

    cy.contains('09:00 - 12:30 Project: Dashboard').click()

    ActivityFormPO.openImg()

    cy.contains('Cannot connect to server').should('be.visible')
    cy.get('[class^="chakra-modal"]').should('be.visible')
  })

  it('should change time using duration input', function() {
    cy.contains('Settings').click()
    // By default is hidden, so we show it
    SettingsPO.toggleShowDurationInput()

    cy.contains('Binnacle').click()

    BinnacleDesktopPO.openTodayActivityForm()
    ActivityFormPO.changeDurationInput('4.25')

    cy.findByLabelText('Start time').should('have.value', '18:00')
    cy.findByLabelText('End time').should('have.value', '22:15')

    cy.get('[data-testid=duration]').clear()

    cy.findByLabelText('Start time').should('have.value', '18:00')
    cy.findByLabelText('End time').should('have.value', '18:00')

    ActivityFormPO.changeEndTime('19:30')

    cy.get('[data-testid=duration]').should('have.value', '1.5')

    ActivityFormPO.changeStartTime('17:15')

    cy.get('[data-testid=duration]').should('have.value', '2.25')
  })
})

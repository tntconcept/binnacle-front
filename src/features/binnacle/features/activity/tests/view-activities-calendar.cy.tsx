import CalendarDesktop from '../ui/calendar-desktop/calendar-desktop'
import { container } from 'tsyringe'
import { ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { FakeActivityRepository } from '../infrastructure/fake-activity-repository'
import { ActivityWithProjectRoleId } from '../domain/activity-with-project-role-id'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'

describe('View activities calendar', () => {
  it('should view activities', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByLabelText('Description').type('Hello world')
    cy.findByRole('button', { name: 'Save' }).click()
  })
})

function setup() {
  const fakeActivityRepository = new FakeActivityRepository()
  const values: ActivityWithProjectRoleId[] = ActivityMother.activitiesWithProjectRoleId()
  cy.stub(fakeActivityRepository, 'getAll').resolves(values)
  // cy.stub(fakeActivityRepository, 'getTimeSummary').resolves(ActivityMother.timeSummary())
  container.register(ACTIVITY_REPOSITORY, {
    useValue: fakeActivityRepository
  })

  cy.mount(<CalendarDesktop />)
}

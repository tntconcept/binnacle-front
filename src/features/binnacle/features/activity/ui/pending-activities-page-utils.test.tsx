import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { adaptActivitiesToTable } from './pending-activities-page-utils'
import { chrono } from '../../../../../shared/utils/chrono'

describe('PendingActivitiesPage', () => {
  it('should return an empty adaptive activity', () => {
    const result = adaptActivitiesToTable([])

    expect(result).toEqual([])
  })

  it('should return an adaptive activity', () => {
    const activities = ActivityMother.activitiesPending()
    const result = adaptActivitiesToTable(activities)
    const expected = [
      {
        action: {
          approval: {
            state: 'PENDING',
            approvedByUserName: 'John Doe',
            approvalDate: new Date('2023-02-28T00:00:00.000Z')
          },
          billable: false,
          description: 'Pending activity in days',
          hasEvidences: false,
          id: 4,
          interval: {
            duration: 6,
            end: new Date('2023-03-30T00:00:00.000Z'),
            start: new Date('2023-03-23T00:00:00.000Z'),
            timeUnit: 'DAYS'
          },
          organization: {
            id: 1,
            name: 'Test organization'
          },
          project: {
            billable: false,
            id: 2,
            name: 'Billable project',
            organizationId: 1
          },
          projectRole: {
            id: 3,
            maxAllowed: 0,
            name: 'Project in days 2',
            organization: {
              id: 1,
              name: 'Test organization'
            },
            project: {
              billable: false,
              id: 1,
              name: 'No billable project'
            },
            projectId: 1,
            remaining: 0,
            requireApproval: true,
            requireEvidence: 'NO',
            timeUnit: 'DAYS',
            userId: 1
          },
          userId: 1
        },
        attachment: false,
        dates: '2023-03-23 - 2023-03-30',
        duration: '6d',
        approval: {
          state: 'PENDING',
          approvedByUserName: 'John Doe',
          approvalDate: chrono(new Date('2023-02-28T00:00:00.000Z')).format(chrono.DATETIME_FORMAT)
        },
        employeeName: undefined,
        id: 4,
        key: 0,
        organization: 'Test organization',
        project: 'Billable project',
        role: 'Project in days 2'
      }
    ]

    expect(result).toEqual(expected)
  })
})

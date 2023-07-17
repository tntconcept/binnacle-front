import { Badge } from '@chakra-ui/react'
import { ActivityMother } from '../../../../../../../test-utils/mothers/activity-mother'
import { activitiesListAdapter } from './activities-list-adapter'

describe('PendingActivitiesPage', () => {
  it('should return an empty adaptive activity', () => {
    const result = activitiesListAdapter([])

    expect(result).toEqual([])
  })

  it('should return an adapted activity', () => {
    const activities = ActivityMother.activitiesPending()
    const result = activitiesListAdapter(activities)
    const expected = [
      {
        action: {
          approvalState: 'PENDING',
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
        approvalState: (
          <Badge borderRadius="md" colorScheme="orange" px="9px" py="5px">
            activity.pending_state
          </Badge>
        ),
        attachment: false,
        duration: '6d',
        dates: '2023-03-23 - 2023-03-30',
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

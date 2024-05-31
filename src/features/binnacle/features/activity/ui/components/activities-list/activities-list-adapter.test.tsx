import { Badge } from '@chakra-ui/react'
import { ActivityMother } from '../../../../../../../test-utils/mothers/activity-mother'
import { activitiesListAdapter } from './activities-list-adapter'
import { TimeUnits } from '../../../../../../../shared/types/time-unit'

describe('ActivitiesListAdapter', () => {
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
          approval: {
            approvalDate: new Date('2023-02-28T00:00:00.000Z'),
            approvedByUserName: 'John Doe',
            state: 'PENDING',
            canBeApproved: false
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
            id: 2,
            name: 'Billable project',
            organizationId: 1,
            projectBillingType: {
              billableByDefault: true,
              name: 'CLOSED_PRICE',
              type: 'ALWAYS'
            }
          },
          projectRole: {
            id: 3,
            name: 'Project in days 2',
            organization: {
              id: 1,
              name: 'Test organization'
            },
            project: {
              id: 1,
              name: 'No billable project',
              projectBillingType: {
                billableByDefault: false,
                name: 'NO_BILLABLE',
                type: 'NEVER'
              }
            },
            timeInfo: {
              timeUnit: TimeUnits.DAYS,
              maxTimeAllowed: {
                byYear: 0,
                byActivity: 0
              },
              userRemainingTime: 0
            },
            projectId: 1,
            requireApproval: true,
            requireEvidence: 'NO',
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

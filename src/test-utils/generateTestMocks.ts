import { Activity } from 'features/binnacle/features/activity/domain/activity'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import { Project } from 'features/binnacle/features/project/domain/project'
import { User } from 'shared/api/users/User'
import { OAuth } from 'shared/types/OAuth'
import { Vacation } from 'features/binnacle/features/vacation/domain/vacation'
import { Holiday } from 'features/binnacle/features/holiday/domain/holiday'
import chrono from 'shared/utils/chrono'
import { TimeSummary } from 'features/binnacle/features/activity/domain/time-summary'
import { SearchProjectRolesResult } from 'features/binnacle/features/search/domain/search-project-roles-result'
import { LiteProjectWithOrganizationId } from 'features/binnacle/features/search/domain/lite-project-with-organization-id'
import { LiteProjectRoleWithProjectId } from 'features/binnacle/features/search/domain/lite-project-role-with-project-id'
import {
  YearBalance,
  YearBalancePerMonth,
  YearBalanceRoles
} from 'features/binnacle/features/activity/domain/year-balance'
import { ActivityDaySummary } from 'features/binnacle/features/activity/domain/activity-day-summary'
import { ActivityWithProjectRoleId } from 'features/binnacle/features/activity/domain/activity-with-project-role-id'
import { OrganizationMother } from './mothers/organization-mother'

export const generateId = () => {
  return Math.floor(Math.random() * 500)
}

export const buildOAuthResource = (): OAuth => ({
  access_token: 'test access token',
  token_type: 'bearer',
  refresh_token: 'test refresh token',
  expires_in: 360,
  scope: 'tnt',
  jti: 'jti code'
})

export const buildProject = (override?: Partial<Project>): Project => {
  return {
    id: generateId(),
    billable: false,
    name: 'Test Project Name',
    open: true,
    ...override
  }
}

export const mockProjectRole = (override?: Partial<ProjectRole>): ProjectRole => {
  return {
    id: generateId(),
    name: 'Test Project Role Name',
    requireEvidence: 'NO',
    timeUnit: 'MINUTES',
    maxAllowed: 0,
    organization: OrganizationMother.organization(),
    project: buildLiteProjectWithOrganizationId(),
    remaining: 0,
    requireApproval: false,
    userId: 0,
    ...override
  }
}

export const mockRecentRole = (override?: Partial<ProjectRole>): ProjectRole => {
  return {
    organization: OrganizationMother.organization(),
    project: buildLiteProjectWithOrganizationId(),
    timeUnit: 'MINUTES',
    maxAllowed: 0,
    remaining: 0,
    requireApproval: false,
    userId: 0,
    id: generateId(),
    requireEvidence: 'NO',
    name: 'Test Recent Role Name',
    ...override
  }
}

export const mockTimeSummary = (override?: Partial<TimeSummary>): TimeSummary => {
  return {
    year: {
      current: {
        worked: 0,
        target: 0,
        balance: 0,
        notRequestedVacations: 0
      }
    },
    months: new Array(12).fill({
      workable: 0,
      worked: 0,
      recommended: 0,
      balance: 0,
      vacations: 0,
      roles: []
    }),
    ...override
  }
}

export const mockActivity = (override?: Partial<Activity>): Activity => {
  return {
    id: generateId(),
    billable: false,
    description: 'Lorem Ipsum...',
    interval: {
      start: chrono.now(),
      end: chrono.now(),
      duration: 0,
      timeUnit: 'DAYS'
    },
    hasEvidences: false,
    organization: OrganizationMother.organization(),
    project: buildLiteProjectWithOrganizationId(),
    projectRole: buildLiteProjectRoleWithProjectId(),
    userId: 0,
    approvalState: 'NA',
    ...override
  }
}

export const buildUser = (override?: Partial<User>): User => {
  return {
    hiringDate: new Date('2020-01-01'),
    ...override
  }
}

export const mockHoliday = (override?: Partial<Holiday>): Holiday => {
  return {
    description: 'Binnacle holiday',
    date: new Date(),
    ...override
  }
}

export const mockVacation = (override?: Partial<Vacation>): Vacation => {
  return {
    id: generateId(),
    observations: 'You are the best!',
    description: 'Hi there!',
    state: 'ACCEPT',
    startDate: new Date('2021-07-08'),
    endDate: new Date('2021-07-09'),
    days: [new Date('2021-07-08'), new Date('2021-07-09')],
    chargeYear: new Date('2021-01-01'),
    ...override
  }
}

export const buildLiteProjectWithOrganizationId = (
  override?: Partial<LiteProjectWithOrganizationId>
): LiteProjectWithOrganizationId => {
  const project = buildProject()
  return {
    billable: false,
    id: project.id,
    name: project.name,
    organizationId: generateId(),
    ...override
  }
}

export const buildLiteProjectRoleWithProjectId = (
  override?: Partial<LiteProjectRoleWithProjectId>
): LiteProjectRoleWithProjectId => {
  const projectRole = mockProjectRole()
  return {
    maxAllowed: 0,
    remaining: 0,
    requireApproval: false,
    requireEvidence: 'NO',
    timeUnit: 'MINUTES',
    id: projectRole.id,
    name: projectRole.name,
    projectId: generateId(),
    ...override
  }
}

export const mockTimeSummaryRelatedRoles = () => {
  return mockTimeSummary({
    months: [
      {
        workable: 160,
        worked: 62.5,
        recommended: 141.77,
        balance: -79.27,
        vacation: 16,
        roles: [
          { id: 123, hours: 37.43 },
          { id: 456, hours: 25.07 }
        ]
      },
      {
        workable: 160,
        worked: 0,
        recommended: 141.77,
        balance: -141.77,
        vacation: 0,
        roles: []
      },
      {
        workable: 160,
        worked: 0,
        recommended: 141.77,
        balance: -141.77,
        vacation: 0,
        roles: []
      },
      {
        workable: 144,
        worked: 0,
        recommended: 127.58,
        balance: -127.58,
        vacation: 40,
        roles: []
      },
      {
        workable: 160,
        worked: 30.18,
        recommended: 141.77,
        balance: -111.59,
        vacation: 0,
        roles: [{ id: 123, hours: 30.18 }]
      },
      {
        workable: 176,
        worked: 0,
        recommended: 155.93,
        balance: -155.93,
        vacation: 0,
        roles: []
      },
      {
        workable: 168,
        worked: 0,
        recommended: 148.85,
        balance: -148.85,
        vacation: 0,
        roles: []
      },
      {
        workable: 176,
        worked: 0,
        recommended: 155.93,
        balance: -155.93,
        vacation: 0,
        roles: []
      },
      {
        workable: 168,
        worked: 0,
        recommended: 148.85,
        balance: -148.85,
        vacation: 0,
        roles: []
      },
      {
        workable: 168,
        worked: 0,
        recommended: 148.85,
        balance: -148.85,
        vacation: 0,
        roles: []
      },
      {
        workable: 160,
        worked: 0,
        recommended: 141.77,
        balance: -141.77,
        vacation: 0,
        roles: []
      },
      {
        workable: 144,
        worked: 0,
        recommended: 127.58,
        balance: -127.58,
        vacation: 0,
        roles: []
      }
    ]
  })
}

export const buildSearchRolesResponse = (
  override?: Partial<SearchProjectRolesResult>
): SearchProjectRolesResult => {
  const organization = OrganizationMother.organization()
  const project = buildLiteProjectWithOrganizationId({
    organizationId: organization.id
  })
  const projectRole123 = buildLiteProjectRoleWithProjectId({
    id: 123,
    projectId: project.id
  })
  const projectRole456 = buildLiteProjectRoleWithProjectId({
    id: 456,
    name: 'Vacaciones',
    projectId: project.id
  })

  return {
    organizations: [organization],
    projects: [project],
    projectRoles: [projectRole123, projectRole456],
    ...override
  }
}

export const buildYearBalanceMonth = (
  override?: Partial<YearBalancePerMonth>
): YearBalancePerMonth => {
  return {
    recommended: 0,
    worked: 0,
    balance: 0,
    vacations: {
      hours: 0,
      percentage: 0
    },
    total: 0,
    ...override
  }
}

export const buildYearBalanceRole = (override?: Partial<YearBalanceRoles>): YearBalanceRoles => {
  return {
    roleId: generateId(),
    organization: OrganizationMother.organization().name,
    project: buildProject().name,
    role: mockProjectRole().name,
    worked: 0,
    months: new Array(12).fill(0),
    ...override
  }
}

export const buildYearBalance = (override?: Partial<YearBalance>): YearBalance => {
  return {
    months: [],
    roles: [],
    ...override
  }
}

export const buildActivityWithProjectRoleId = (
  override?: Partial<ActivityWithProjectRoleId>
): ActivityWithProjectRoleId => {
  return {
    id: generateId(),
    billable: false,
    description: 'Lorem Ipsum...',
    interval: {
      start: chrono(new Date('2023-02-28 00:00:00')).getDate(),
      end: chrono(new Date('2023-03-03 00:00:00')).getDate(),
      duration: 4,
      timeUnit: 'DAYS'
    },
    hasEvidences: false,
    projectRoleId: mockProjectRole().id,
    userId: 0,
    approvalState: 'NA',
    ...override
  }
}

export const buildActivityDaySummary = (
  override: ActivityDaySummary[] = []
): ActivityDaySummary[] => {
  return [
    {
      date: new Date('2023-01-01'),
      worked: 0
    },
    ...override
  ]
}

export const buildActivityDaySummaryForMarch = (): ActivityDaySummary[] => {
  return [
    {
      date: new Date('2023-02-27'),
      worked: 0
    },
    {
      date: new Date('2023-02-28'),
      worked: 0
    },
    {
      date: new Date('2023-03-01'),
      worked: 0
    },
    {
      date: new Date('2023-03-02'),
      worked: 0
    },
    {
      date: new Date('2023-03-03'),
      worked: 0
    },
    {
      date: new Date('2023-03-04'),
      worked: 0
    },
    {
      date: new Date('2023-03-05'),
      worked: 0
    },
    {
      date: new Date('2023-03-06'),
      worked: 0
    },
    {
      date: new Date('2023-03-07'),
      worked: 0
    },
    {
      date: new Date('2023-03-08'),
      worked: 0
    },
    {
      date: new Date('2023-03-09'),
      worked: 0
    },
    {
      date: new Date('2023-03-10'),
      worked: 0
    },
    {
      date: new Date('2023-03-11'),
      worked: 0
    },
    {
      date: new Date('2023-03-12'),
      worked: 0
    },
    {
      date: new Date('2023-03-13'),
      worked: 240
    },
    {
      date: new Date('2023-03-14'),
      worked: 0
    },
    {
      date: new Date('2023-03-15'),
      worked: 0
    },
    {
      date: new Date('2023-03-16'),
      worked: 0
    },
    {
      date: new Date('2023-03-17'),
      worked: 0
    },
    {
      date: new Date('2023-03-18'),
      worked: 0
    },
    {
      date: new Date('2023-03-19'),
      worked: 0
    },
    {
      date: new Date('2023-03-20'),
      worked: 0
    },
    {
      date: new Date('2023-03-21'),
      worked: 0
    },
    {
      date: new Date('2023-03-22'),
      worked: 0
    },
    {
      date: new Date('2023-03-23'),
      worked: 0
    },
    {
      date: new Date('2023-03-24'),
      worked: 0
    },
    {
      date: new Date('2023-03-25'),
      worked: 0
    },
    {
      date: new Date('2023-03-26'),
      worked: 0
    },
    {
      date: new Date('2023-03-27'),
      worked: 0
    },
    {
      date: new Date('2023-03-28'),
      worked: 0
    },
    {
      date: new Date('2023-03-29'),
      worked: 0
    },
    {
      date: new Date('2023-03-30'),
      worked: 0
    },
    {
      date: new Date('2023-03-31'),
      worked: 0
    },
    {
      date: new Date('2023-04-01'),
      worked: 0
    },
    {
      date: new Date('2023-04-02'),
      worked: 0
    }
  ]
}

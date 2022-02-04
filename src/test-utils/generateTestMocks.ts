import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import type { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'
import type { ProjectRole } from 'modules/binnacle/data-access/interfaces/project-role.interface'
import type { Project } from 'modules/binnacle/data-access/interfaces/project.interface'
import type { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import type { User } from 'shared/api/users/User'
import type { OAuth } from 'shared/types/OAuth'
import type { Vacation } from 'shared/types/Vacation'
import type { Holiday } from 'shared/types/Holiday'
import chrono from 'shared/utils/chrono'
import { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'
import { TimeBalance } from 'modules/binnacle/data-access/interfaces/time-balance.interface'
import { WorkingBalance } from '../modules/binnacle/data-access/interfaces/working-balance.interface'

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

export const buildOrganization = (override?: Partial<Organization>): Organization => {
  return {
    id: generateId(),
    name: 'Test Organization Name',
    ...override
  }
}

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
    requireEvidence: false,
    ...override
  }
}

export const mockRecentRole = (override?: Partial<RecentRole>): RecentRole => {
  return {
    id: generateId(),
    requireEvidence: false,
    name: 'Test Recent Role Name',
    date: chrono.now().toISOString(),
    projectBillable: false,
    projectName: 'Test Recent Role Project Name',
    organizationName: 'Test Organization Name',
    ...override
  }
}

export const mockTimeBalance = (override?: Partial<TimeBalance>): TimeBalance => {
  return {
    timeDifference: 0,
    timeToWork: 0,
    timeWorked: 0,
    ...override
  }
}

export const mockWorkingBalance = (override?: Partial<WorkingBalance>): WorkingBalance => {
  return {
    annualBalance: {
      worked: 0,
      targetWork: 0
    },
    monthlyBalances: {
      '0': {
        worked: 0,
        recommendedWork: 0
      },
      '1': {
        worked: 0,
        recommendedWork: 0
      },
      '2': {
        worked: 0,
        recommendedWork: 0
      }
    },
    ...override
  }
}

export const mockActivity = (override?: Partial<Activity>): Activity => {
  return {
    id: generateId(),
    billable: false,
    description: 'Lorem Ipsum...',
    startDate: chrono.now(),
    duration: 100,
    imageFile: '',
    hasImage: false,
    organization: buildOrganization(),
    project: buildProject(),
    projectRole: mockProjectRole(),
    userId: 0,
    ...override
  }
}

export const mockActivityDay = (override?: Partial<ActivitiesPerDay>) => {
  const activities = override?.activities ?? [mockActivity()]

  return {
    date: new Date(),
    workedMinutes: activities.map(a => a.duration).reduce((previousValue, currentValue) => previousValue + currentValue, 0),
    ...override,
    activities: activities
  }
}

export const buildUser = (override?: Partial<User>): User => {
  return {
    id: 10,
    agreement: {
      id: 100,
      holidaysQuantity: 22,
      yearDuration: 0
    },
    agreementYearDuration: 0,
    dayDuration: 480,
    departmentId: 20,
    email: 'johndoe@test.com',
    genre: '',
    hiringDate: new Date('2020-01-01'),
    username: 'jdoe',
    name: 'John Doe',
    photoUrl: '',
    role: {
      id: 30,
      name: 'usuario'
    },
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

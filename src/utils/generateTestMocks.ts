import { IOAuth } from 'api/interfaces/IOAuth'
import { IActivity } from 'api/interfaces/IActivity'
import { IOrganization } from 'api/interfaces/IOrganization'
import { IProjectRole } from 'api/interfaces/IProjectRole'
import { IProject } from 'api/interfaces/IProject'
import { IRecentRole } from 'api/interfaces/IRecentRole'

const generateId = () => {
  return Math.floor(Math.random() * 500)
}

export const buildOAuthResource = (): IOAuth => ({
  access_token: 'test access token',
  token_type: 'bearer',
  refresh_token: 'test refresh token',
  expires_in: 360,
  scope: 'tnt',
  jti: 'jti code'
})

export const buildOrganization = (
  override?: Partial<IOrganization>
): IOrganization => {
  return {
    id: generateId(),
    name: 'Test Organization Name',
    ...override
  }
}

export const buildProject = (override?: Partial<IProject>): IProject => {
  return {
    id: generateId(),
    billable: false,
    name: 'Test Project Name',
    open: true,
    ...override
  }
}

export const buildProjectRole = (override?: Partial<IProjectRole>): IProjectRole => {
  return {
    id: generateId(),
    name: 'Test Project Role Name',
    requireEvidence: false,
    ...override
  }
}

export const buildRecentRole = (override?: Partial<IRecentRole>): IRecentRole => {
  return {
    id: generateId(),
    requireEvidence: false,
    name: 'Test Recent Role Name',
    date: new Date(),
    projectBillable: false,
    projectName: 'Test Recent Role Project Name',
    organizationName: 'Test Organization Name',
    ...override
  }
}

export const buildActivity = (override?: Partial<IActivity>): IActivity => {
  return {
    id: generateId(),
    billable: false,
    description: 'Lorem Ipsum...',
    startDate: new Date(),
    duration: 100,
    imageFile: '',
    hasImage: false,
    organization: buildOrganization(),
    project: buildProject(),
    projectRole: buildProjectRole(),
    userId: 0,
    ...override
  }
}

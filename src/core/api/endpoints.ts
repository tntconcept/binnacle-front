const PREFIX_ENDPOINT = 'api/'
const withPrefix = (endpoint: string) => {
  return PREFIX_ENDPOINT + endpoint
}

const endpoints = {
  auth: 'oauth/token',
  user: withPrefix('user'),
  activities: withPrefix('activities'),
  timeBalance: withPrefix('time-balance'),
  holidays: withPrefix('holidays'),
  organizations: withPrefix('organizations'),
  projects: withPrefix('projects'),
  projectRoles: withPrefix('project-roles'),
  recentProjectRoles: withPrefix('project-roles/recents')
}

export default endpoints

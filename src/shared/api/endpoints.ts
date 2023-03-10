const BASE_URL =
  (process.env.REACT_APP_API_BASE_URL || window.location.origin) +
  (process.env.REACT_APP_API_SUBDIRECTORY_PATH || '').slice(0, -1)

const endpoints = {
  user: `${BASE_URL}/api/user/me`,
  activity: `${BASE_URL}/api/activity`,
  holidays: `${BASE_URL}/api/holidays`,
  organizations: `${BASE_URL}/api/organizations`,
  projects: `${BASE_URL}/api/projects`,
  projectRoles: `${BASE_URL}/api/project-roles`,
  recentProjectRoles: `${BASE_URL}/api/project-roles/recents`,
  vacations: `${BASE_URL}/api/vacations`,
  vacationsDays: `${BASE_URL}/api/vacations/days`,
  vacationsDetails: `${BASE_URL}/api/vacations/details`,
  timeSummary: `${BASE_URL}/api/time-summary`,
  version: `${BASE_URL}/api/version`,
  googleLogin: `${BASE_URL}/oauth/login/google`,
  logout: `${BASE_URL}/logout`,
  search: `${BASE_URL}/api/search`
}

export default endpoints

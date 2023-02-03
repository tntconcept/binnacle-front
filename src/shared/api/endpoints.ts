const BASE_URL =
  (process.env.REACT_APP_API_BASE_URL || window.location.origin) +
  (process.env.REACT_APP_API_SUBDIRECTORY_PATH || '').slice(0, -1)

const endpoints = {
  user: `${BASE_URL}/api/user`,
  activities: `${BASE_URL}/api/activities`,
  holidays: `${BASE_URL}/api/holidays`,
  organizations: `${BASE_URL}/api/organizations`,
  projects: `${BASE_URL}/api/projects`,
  projectRoles: `${BASE_URL}/api/project-roles`,
  recentProjectRoles: `${BASE_URL}/api/project-roles/recents`,
  vacations: `${BASE_URL}/api/vacations`,
  vacationsDays: `${BASE_URL}/api/vacations/days`,
  vacationsDetails: `${BASE_URL}/api/vacations/details`,
  workingTime: `${BASE_URL}/api/working-time`,
  version: `${BASE_URL}/api/version`,
  googleLogin: `${BASE_URL}/oauth/login/google`,
  logout: `${BASE_URL}/logout`
}

export default endpoints

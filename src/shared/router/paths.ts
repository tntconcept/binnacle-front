export const basename = process.env.PUBLIC_URL ?? ''

export const rawPaths = {
  login: '/login',
  home: '/',
  calendar: '/binnacle/calendar',
  binnacle: '/binnacle',
  vacations: '/vacations',
  settings: '/settings',
  pendingActivities: '/binnacle/pending-activities',
  projects: '/administration/projects',
  activities: '/binnacle/activities',
  subcontractedActivities: '/binnacle/subcontracted-activities',
  availability: '/binnacle/availability'
}

export const paths = {
  login: `${basename}${rawPaths.login}`,
  home: `${basename}${rawPaths.home}`,
  calendar: `${basename}${rawPaths.calendar}`,
  binnacle: `${basename}${rawPaths.binnacle}`,
  vacations: `${basename}${rawPaths.vacations}`,
  settings: `${basename}${rawPaths.settings}`,
  pendingActivities: `${basename}${rawPaths.pendingActivities}`,
  projects: `${basename}${rawPaths.projects}`,
  activities: `${basename}${rawPaths.activities}`,
  subcontractedActivities: `${basename}${rawPaths.subcontractedActivities}`,
  availability: `${basename}${rawPaths.availability}`
}

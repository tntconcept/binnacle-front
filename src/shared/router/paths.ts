export const basename = process.env.PUBLIC_URL || ''

export const rawPaths = {
  login: '/login',
  home: '/',
  calendar: '/binnacle/calendar',
  binnacle: '/binnacle',
  vacations: '/vacations',
  settings: '/settings',
  pendingActivities: '/binnacle/pending-activities',
  projects: '/administration/projects'
}

export const paths = {
  login: `${basename}${rawPaths.login}`,
  home: `${basename}${rawPaths.home}`,
  calendar: `${basename}${rawPaths.calendar}`,
  binnacle: `${basename}${rawPaths.binnacle}`,
  vacations: `${basename}${rawPaths.vacations}`,
  settings: `${basename}${rawPaths.settings}`,
  pendingActivities: `${basename}${rawPaths.pendingActivities}`,
  projects: `${basename}${rawPaths.projects}`
}

export const basename = process.env.PUBLIC_URL || ''
const route = (absolutePath: string) => absolutePath.substr(absolutePath.lastIndexOf('/') + 1)

export const paths = {
  login: `${basename}/login`,
  home: `${basename}/`,
  calendar: `${basename}/${route(`/calendar`)}`,
  binnacle: `${basename}/${route(`/binnacle`)}`,
  vacations: `${basename}/${route(`/vacations`)}`,
  settings: `${basename}/${route(`/settings`)}`
}

export const rawPaths = {
  login: '/login',
  home: route('/'),
  calendar: route('/calendar'),
  binnacle: route('/binnacle'),
  vacations: route('/vacations'),
  settings: route('/settings')
}

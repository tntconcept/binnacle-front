export const basename = process.env.PUBLIC_URL || ''
const route = (absolutePath: string) => absolutePath.substr(absolutePath.lastIndexOf('/') + 1)

export const paths = {
  login: `${basename}/`,
  binnacle: `${basename}/${route(`/binnacle`)}`,
  activity: `${basename}/binnacle/activity`,
  vacations: `${basename}/${route(`/vacations`)}`,
  settings: `${basename}/${route(`/settings`)}`
}

export const rawPaths = {
  login: '/',
  binnacle: route('/binnacle'),
  activity: route('/binnacle/activity'),
  vacations: route('/vacations'),
  settings: route('/settings')
}

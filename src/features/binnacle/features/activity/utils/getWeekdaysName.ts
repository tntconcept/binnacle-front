import { isSpanishLocale } from 'shared/utils/chrono'

export const getWeekdaysName = () => {
  const isSpanish = isSpanishLocale()
  if (isSpanish) {
    return ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']
  }
  return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
}

import chrono from 'shared/utils/chrono'

export const formatDayAndMonth = (date: Date, language: string) => {
  const isSpanish = language === 'es-ES' || language === 'es'
  const dateFormat = isSpanish ? "dd 'de' MMMM" : 'dd MMMM'
  return chrono(date).format(dateFormat)
}

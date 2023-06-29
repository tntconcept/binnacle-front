export const isPastMonth = (targetDate: Date) => {
  const now = new Date()
  const year = now.getFullYear()
  const targetYear = targetDate.getFullYear()

  const isPastYear = targetYear < year

  const isSameYear = year === targetYear
  const isPastMonth = targetDate.getMonth() < now.getMonth()

  const isPast = isPastYear || (isSameYear && isPastMonth)

  return isPast
}

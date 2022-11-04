export const isPastDate = (targetDate: Date) => {
  const now = new Date()
  const year = now.getFullYear()

  const targetYear = targetDate.getFullYear()

  return targetYear < year
}

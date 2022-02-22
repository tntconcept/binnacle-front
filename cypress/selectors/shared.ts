export const shared = {
  notification() {
    return cy.findByLabelText('alert')
  }
}

export function getFirstMonday(today: Date): Date {
  today.setDate(0)
  while (today.getDay() !== 1) {
    const nextDay = today.getDate() + 1
    today.setDate(nextDay)
  }
  return today
}

export function getPrevMonth(actual: number): string {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  return actual >= 1 ? monthNames[actual - 1] : monthNames[11]
}

export function getWeekDay(actual: number): string {
  const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Thursday', 'Wednesday', 'Friday', 'Saturday']
  return weekNames[actual]
}

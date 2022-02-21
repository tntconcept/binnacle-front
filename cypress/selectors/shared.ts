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

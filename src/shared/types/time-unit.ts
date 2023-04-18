export const TimeUnits = {
  MINUTES: 'MINUTES',
  DAYS: 'DAYS'
} as const

export type TimeUnit = keyof typeof TimeUnits

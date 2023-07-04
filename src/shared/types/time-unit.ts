export const TimeUnits = {
  MINUTES: 'MINUTES',
  DAYS: 'DAYS',
  NATURAL_DAYS: 'NATURAL_DAYS'
} as const

export type TimeUnit = keyof typeof TimeUnits

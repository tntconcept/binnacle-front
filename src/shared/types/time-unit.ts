export const TimeUnits = {
  MINUTES: 'MINUTES',
  DAY: 'DAY'
} as const

export type TimeUnit = keyof typeof TimeUnits

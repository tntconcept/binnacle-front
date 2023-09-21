const AbsenceTypes = {
  VACATION: 'VACATION',
  PAID_LEAVE: 'PAID_LEAVE'
}

export type AbsenceType = keyof typeof AbsenceTypes

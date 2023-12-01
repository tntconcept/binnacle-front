import { Absence } from './absence'
import { AbsenceOverflow } from './absence-overflow'

export type AbsenceWithOverflowInfo = Absence & { overflowType: AbsenceOverflow }

import { Vacation } from './vacation'

export type UpdateVacation = Pick<Vacation, 'id' | 'startDate' | 'endDate' | 'description'>

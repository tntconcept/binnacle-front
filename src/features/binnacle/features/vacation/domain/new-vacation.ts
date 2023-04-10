import { Vacation } from './vacation'

export type NewVacation = Pick<Vacation, 'startDate' | 'endDate' | 'description'>

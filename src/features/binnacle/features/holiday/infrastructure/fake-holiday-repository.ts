import { HolidayMother } from '../../../../../test-utils/mothers/holiday-mother'
import { singleton } from 'tsyringe'
import { Holiday } from '../domain/holiday'
import { HolidayRepository } from '../domain/holiday-repository'

@singleton()
export class FakeHolidayRepository implements HolidayRepository {
  async getAll(): Promise<Holiday[]> {
    return HolidayMother.holidays()
  }
}

import { Days } from 'shared/types/days'
import { VacationMother } from 'test-utils/mothers/vacation-mother'
import { singleton } from 'tsyringe'
import { Vacation } from '../domain/vacation'
import { VacationGenerated } from '../domain/vacation-generated'
import { VacationRepository } from '../domain/vacation-repository'
import { VacationSummary } from '../domain/vacation-summary'

@singleton()
export class FakeVacationRepository implements VacationRepository {
  async getAllForDateInterval(): Promise<Vacation[]> {
    return VacationMother.vacations()
  }
  async getAll(): Promise<Vacation[]> {
    return VacationMother.vacations()
  }

  async create(): Promise<VacationGenerated[]> {
    return VacationMother.vacationsGenerated()
  }

  async update(): Promise<VacationGenerated[]> {
    return VacationMother.vacationsGenerated()
  }

  async delete(): Promise<void> {
    return
  }

  async getDaysForVacationPeriod(): Promise<Days> {
    return 5
  }

  async getVacationSummary(): Promise<VacationSummary> {
    return VacationMother.vacationSummary()
  }
}

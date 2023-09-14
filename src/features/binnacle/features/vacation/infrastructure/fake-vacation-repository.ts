import { Days } from '../../../../../shared/types/days'
import { VacationMother } from '../../../../../test-utils/mothers/vacation-mother'
import { singleton } from 'tsyringe'
import { Vacation } from '../domain/vacation'
import { VacationGenerated } from '../domain/vacation-generated'
import { VacationRepository } from '../domain/vacation-repository'
import { VacationSummary } from '../domain/vacation-summary'
import { NewVacation } from '../domain/new-vacation'

@singleton()
export class FakeVacationRepository implements VacationRepository {
  private vacations: Vacation[] = VacationMother.vacations()

  async getAllForDateInterval(): Promise<Vacation[]> {
    return this.vacations
  }

  async getAll(): Promise<Vacation[]> {
    return this.vacations
  }

  async create(newVacation: NewVacation): Promise<VacationGenerated> {
    this.vacations.push(VacationMother.customVacation(newVacation))
    return VacationMother.marchVacationGenerated()
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

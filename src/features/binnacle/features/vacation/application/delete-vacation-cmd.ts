import { Command, UseCaseKey } from '@archimedes/arch'
import { VACATION_REPOSITORY } from 'shared/di/container-tokens'
import { Id } from 'shared/types/id'
import { inject, singleton } from 'tsyringe'
import type { VacationRepository } from '../domain/vacation-repository'

@UseCaseKey('DeleteVacationCmd')
@singleton()
export class DeleteVacationCmd extends Command<Id> {
  constructor(@inject(VACATION_REPOSITORY) private vacationRepository: VacationRepository) {
    super()
  }

  async internalExecute(vacationId: Id): Promise<void> {
    await this.vacationRepository.delete(vacationId)
  }
}

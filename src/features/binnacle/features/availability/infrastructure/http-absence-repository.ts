import { singleton } from 'tsyringe'
import { AbsenceRepository } from '../domain/absence-repository'
import { HttpClient } from '../../../../../shared/http/http-client'
import { AbsenceFilters } from '../domain/absence-filters'
import { UserAbsence } from '../domain/user-absence'

@singleton()
export class HttpAbsenceRepository implements AbsenceRepository {
  protected static absencePath = '/api/absence'

  constructor(private httpClient: HttpClient) {}

  async getAbsences(absenceFilters: AbsenceFilters): Promise<UserAbsence[]> {
    return await this.httpClient.get<UserAbsence[]>(HttpAbsenceRepository.absencePath, {
      params: absenceFilters
    })
  }
}

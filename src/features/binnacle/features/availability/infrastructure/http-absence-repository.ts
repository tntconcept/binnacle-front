import { singleton } from 'tsyringe'
import { AbsenceRepository } from '../domain/absence-repository'
import { Absence } from '../domain/absence'
import { HttpClient } from '../../../../../shared/http/http-client'
import { AbsenceFilters } from '../domain/absence-filters'

@singleton()
export class HttpAbsenceRepository implements AbsenceRepository {
  protected static absencePath = '/api/absence'

  constructor(private httpClient: HttpClient) {}

  async getAbsences(absenceFilters: AbsenceFilters): Promise<Absence[]> {
    return await this.httpClient.get<Absence[]>(HttpAbsenceRepository.absencePath, {
      params: absenceFilters
    })
  }
}

import { AbsenceRepository } from '../domain/absence-repository'
import { Absence } from '../domain/absence'
import { AbsenceMother } from '../../../../../test-utils/mothers/absence-mother'
import { singleton } from 'tsyringe'

@singleton()
export class FakeAbsenceRepository implements AbsenceRepository {
  async getAbsences(): Promise<Absence[]> {
    return AbsenceMother.absences()
  }
}

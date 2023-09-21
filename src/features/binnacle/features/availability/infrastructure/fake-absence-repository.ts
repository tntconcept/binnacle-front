import { AbsenceRepository } from '../domain/absence-repository'
import { Absence } from '../domain/absence'
import { AbsenceMother } from '../../../../../test-utils/mothers/absence-mother'

export class FakeAbsenceRepository implements AbsenceRepository {
  async getAbsences(): Promise<Absence[]> {
    return AbsenceMother.absences()
  }
}

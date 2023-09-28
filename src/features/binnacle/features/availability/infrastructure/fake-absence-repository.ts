import { AbsenceRepository } from '../domain/absence-repository'
import { AbsenceMother } from '../../../../../test-utils/mothers/absence-mother'
import { singleton } from 'tsyringe'
import { UserAbsence } from '../domain/user-absence'

@singleton()
export class FakeAbsenceRepository implements AbsenceRepository {
  async getAbsences(): Promise<UserAbsence[]> {
    return AbsenceMother.userAbsences()
  }
}

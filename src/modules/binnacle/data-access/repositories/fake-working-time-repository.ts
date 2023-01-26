import { mockWorkingTimeRelatedRoles } from 'test-utils/generateTestMocks'
import { singleton } from 'tsyringe'
import { WorkingTime } from '../interfaces/working-time.interface'

@singleton()
export class FakeWorkingTimeRepository {
  async getWorkingTime(date: Date): Promise<WorkingTime> {
    console.log(date)
    return mockWorkingTimeRelatedRoles()
  }
}

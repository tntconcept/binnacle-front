import { IOrganization } from 'api/interfaces/IOrganization'
import { IProjectRole } from 'api/interfaces/IProjectRole'
import { IProject } from 'api/interfaces/IProject'

interface BaseActivity {
  id: number
  startDate: Date
  duration: number
  description: string
  userId: number
  billable: boolean
  hasImage: boolean
  imageFile?: string
}

export interface IActivity extends BaseActivity {
  organization: IOrganization
  project: IProject
  projectRole: IProjectRole
}

export type IActivityRequestBody = Omit<BaseActivity, 'userId'> & {
  projectRoleId: number
}

export interface IActivityDay {
  date: Date
  workedMinutes: number
  activities: IActivity[]
}

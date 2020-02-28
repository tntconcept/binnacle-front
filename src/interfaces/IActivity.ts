import {IOrganization} from "interfaces/IOrganization"
import {IProjectRole} from "interfaces/IProjectRole"
import {IProject} from "interfaces/IProject"

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
  organization: IOrganization;
  project: IProject;
  projectRole: IProjectRole;
}

export type IActivityRequestDTO = Omit<BaseActivity, "userId"> & { projectRoleId: number}

export interface IActivityDay {
  date: Date;
  workedMinutes: number;
  activities: IActivity[];
}

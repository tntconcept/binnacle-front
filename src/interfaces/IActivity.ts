import {IOrganization} from "interfaces/IOrganization"
import {IProjectRole} from "interfaces/IProjectRole"
import {IProject} from "interfaces/IProject"

export interface IActivity {
  id: number;
  startDate: Date;
  duration: number;
  description: string;
  projectRole: IProjectRole;
  userId: number;
  billable: boolean;
  organization: IOrganization;
  project: IProject;
}


export interface IActivityDay {
  date: Date;
  workedMinutes: number;
  activities: IActivity[];
}

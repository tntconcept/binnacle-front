import {
  Archimedes,
  CacheInvalidations,
  CacheLink,
  CacheManager,
  ExecutorLink,
  InvalidationPolicy
} from '@archimedes/arch'
import { LogoutCmd } from '../../features/auth/application/logout-cmd'
import { ApproveActivityCmd } from '../../features/binnacle/features/activity/application/approve-activity-cmd'
import { CreateActivityCmd } from '../../features/binnacle/features/activity/application/create-activity-cmd'
import { DeleteActivityCmd } from '../../features/binnacle/features/activity/application/delete-activity-cmd'
import { GetActivitiesQry } from '../../features/binnacle/features/activity/application/get-activities-qry'
import { GetActivityEvidenceQry } from '../../features/binnacle/features/activity/application/get-activity-image-qry'
import { GetActivitySummaryQry } from '../../features/binnacle/features/activity/application/get-activity-summary-qry'
import { GetCalendarDataQry } from '../../features/binnacle/features/activity/application/get-calendar-data-qry'
import { GetDaysForActivityDaysPeriodQry } from '../../features/binnacle/features/activity/application/get-days-for-activity-days-period-qry'
import { GetActivitiesByFiltersQry } from '../../features/binnacle/features/activity/application/get-activities-by-filters-qry'
import { GetTimeSummaryQry } from '../../features/binnacle/features/activity/application/get-time-summary-qry'
import { GetYearBalanceQry } from '../../features/binnacle/features/activity/application/get-year-balance-qry'
import { UpdateActivityCmd } from '../../features/binnacle/features/activity/application/update-activity-cmd'
import { GetProjectRolesQry } from '../../features/binnacle/features/project-role/application/get-project-roles-qry'
import { GetRecentProjectRolesQry } from '../../features/binnacle/features/project-role/application/get-recent-project-roles-qry'
import { SearchProjectRolesQry } from '../../features/binnacle/features/search/application/search-project-roles-qry'
import { CreateVacationCmd } from '../../features/binnacle/features/vacation/application/create-vacation-cmd'
import { DeleteVacationCmd } from '../../features/binnacle/features/vacation/application/delete-vacation-cmd'
import { GetAllVacationsForDateIntervalQry } from '../../features/binnacle/features/vacation/application/get-all-vacations-for-date-interval-qry'
import { GetAllVacationsQry } from '../../features/binnacle/features/vacation/application/get-all-vacations-qry'
import { GetDaysForVacationPeriodQry } from '../../features/binnacle/features/vacation/application/get-days-for-vacation-period-qry'
import { GetVacationSummaryQry } from '../../features/binnacle/features/vacation/application/get-vacation-summary-qry'
import { UpdateVacationCmd } from '../../features/binnacle/features/vacation/application/update-vacation-cmd'
import { GetUserSettingsQry } from '../../features/shared/user/features/settings/application/get-user-settings-qry'
import { SaveUserSettingsCmd } from '../../features/shared/user/features/settings/application/save-user-settings-cmd'
import { TOAST } from '../di/container-tokens'
import { container } from 'tsyringe'
import { BlockProjectCmd } from '../../features/administration/features/project/application/block-project-cmd'
import { GetProjectsWithBlockerUserName } from '../../features/administration/features/project/application/get-projects-with-blocker-user-name'
import { UnblockProjectCmd } from '../../features/administration/features/project/application/unblock-project-cmd'
import { ToastNotificationLink } from './links/toast-notification-link'
import { ToastType } from '../notification/toast'
import { GetAbsencesQry } from '../../features/binnacle/features/availability/application/get-absences-qry'
import { GetSubcontractedActivitiesQry } from '../../features/binnacle/features/activity/application/get-subcontracted-activities-qry'
import { CreateSubcontractedActivityCmd } from '../../features/binnacle/features/activity/application/create-subcontracted-activity-cmd'
import { UpdateSubcontractedActivityCmd } from '../../features/binnacle/features/activity/application/update-subcontracted-activity-cmd'
import { DeleteSubcontractedActivityCmd } from '../../features/binnacle/features/activity/application/delete-subcontracted-activity-cmd'

const toast = container.resolve<ToastType>(TOAST)
Archimedes.createChain([
  new CacheLink(new CacheManager()),
  new ExecutorLink(),
  new ToastNotificationLink(toast)
])

// User
CacheInvalidations.set(LogoutCmd.prototype.key, [InvalidationPolicy.ALL])
CacheInvalidations.set(SaveUserSettingsCmd.prototype.key, [GetUserSettingsQry.prototype.key])

// Activities
const activityRelatedQueries = [
  GetActivitiesQry.prototype.key,
  GetActivitySummaryQry.prototype.key,
  GetTimeSummaryQry.prototype.key,
  GetYearBalanceQry.prototype.key,
  SearchProjectRolesQry.prototype.key,
  GetCalendarDataQry.prototype.key,
  GetRecentProjectRolesQry.prototype.key,
  GetDaysForActivityDaysPeriodQry.prototype.key,
  GetActivityEvidenceQry.prototype.key
]
CacheInvalidations.set(GetActivitiesByFiltersQry.prototype.key, [InvalidationPolicy.NO_CACHE])
CacheInvalidations.set(GetProjectRolesQry.prototype.key, [InvalidationPolicy.NO_CACHE])
CacheInvalidations.set(CreateActivityCmd.prototype.key, activityRelatedQueries)
CacheInvalidations.set(UpdateActivityCmd.prototype.key, activityRelatedQueries)
CacheInvalidations.set(DeleteActivityCmd.prototype.key, activityRelatedQueries)
CacheInvalidations.set(ApproveActivityCmd.prototype.key, activityRelatedQueries)

const subcontractedActivityRelatedQueries = [GetSubcontractedActivitiesQry.prototype.key]
CacheInvalidations.set(
  CreateSubcontractedActivityCmd.prototype.key,
  subcontractedActivityRelatedQueries
)
CacheInvalidations.set(
  UpdateSubcontractedActivityCmd.prototype.key,
  subcontractedActivityRelatedQueries
)
CacheInvalidations.set(
  DeleteSubcontractedActivityCmd.prototype.key,
  subcontractedActivityRelatedQueries
)

// Vacation
CacheInvalidations.set(CreateVacationCmd.prototype.key, [
  GetAllVacationsQry.prototype.key,
  GetAllVacationsForDateIntervalQry.prototype.key,
  GetDaysForVacationPeriodQry.prototype.key,
  GetVacationSummaryQry.prototype.key,
  GetYearBalanceQry.prototype.key,
  GetTimeSummaryQry.prototype.key,
  GetActivitiesQry.prototype.key,
  GetCalendarDataQry.prototype.key,
  GetActivitySummaryQry.prototype.key
])
CacheInvalidations.set(DeleteVacationCmd.prototype.key, [
  GetAllVacationsQry.prototype.key,
  GetAllVacationsForDateIntervalQry.prototype.key,
  GetDaysForVacationPeriodQry.prototype.key,
  GetVacationSummaryQry.prototype.key,
  GetYearBalanceQry.prototype.key,
  GetTimeSummaryQry.prototype.key,
  GetActivitiesQry.prototype.key,
  GetCalendarDataQry.prototype.key,
  GetActivitySummaryQry.prototype.key
])
CacheInvalidations.set(UpdateVacationCmd.prototype.key, [
  GetAllVacationsQry.prototype.key,
  GetAllVacationsForDateIntervalQry.prototype.key,
  GetDaysForVacationPeriodQry.prototype.key,
  GetVacationSummaryQry.prototype.key,
  GetYearBalanceQry.prototype.key,
  GetTimeSummaryQry.prototype.key,
  GetActivitiesQry.prototype.key,
  GetCalendarDataQry.prototype.key,
  GetActivitySummaryQry.prototype.key
])

//Block
CacheInvalidations.set(BlockProjectCmd.prototype.key, [
  GetProjectsWithBlockerUserName.prototype.key
])
CacheInvalidations.set(UnblockProjectCmd.prototype.key, [
  GetProjectsWithBlockerUserName.prototype.key
])

//Absence
CacheInvalidations.set(GetAbsencesQry.prototype.key, [InvalidationPolicy.NO_CACHE])

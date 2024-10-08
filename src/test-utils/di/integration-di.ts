import 'reflect-metadata'
import { container } from 'tsyringe'
import {
  ABSENCE_REPOSITORY,
  ACTIVITY_REPOSITORY,
  AUTH_REPOSITORY,
  HOLIDAY_REPOSITORY,
  ORGANIZATION_REPOSITORY,
  PROJECT_REPOSITORY,
  PROJECT_ROLE_REPOSITORY,
  SEARCH_REPOSITORY,
  STORAGE,
  SUBCONTRACTED_ACTIVITY_REPOSITORY,
  TOAST,
  USER_REPOSITORY,
  USER_SETTINGS_REPOSITORY,
  VACATION_REPOSITORY,
  VERSION_REPOSITORY
} from '../../shared/di/container-tokens'
import { FakeVersionRepository } from '../../features/version/infrastructure/fake-version-repository'
import { FakeAuthRepository } from '../../features/auth/infrastructure/fake-auth-repository'
import { FakeUserRepository } from '../../features/shared/user/infrastructure/fake-user-repository'
import { FakeVacationRepository } from '../../features/binnacle/features/vacation/infrastructure/fake-vacation-repository'
import { FakeHolidayRepository } from '../../features/binnacle/features/holiday/infrastructure/fake-holiday-repository'
import { FakeSearchRepository } from '../../features/binnacle/features/search/infrastructure/fake-search-repository'
import { FakeProjectRoleRepository } from '../../features/binnacle/features/project-role/infrastructure/fake-project-role-repository'
import { FakeOrganizationRepository } from '../../features/binnacle/features/organization/infrastructure/fake-organization-repository'
import { FakeActivityRepository } from '../../features/binnacle/features/activity/infrastructure/fake-activity-repository'
import { toast, ToastType } from '../../shared/notification/toast'
import { FakeUserSettingsRepository } from '../../features/shared/user/features/settings/infrastructure/fake-user-settings-repository'
import { FakeProjectRepository } from '../../features/shared/project/infrastructure/fake-project-repository'
import { FakeAbsenceRepository } from '../../features/binnacle/features/availability/infrastructure/fake-absence-repository'
import { FakeSubcontractedActivityRepository } from '../../features/binnacle/features/activity/infrastructure/fake-subcontracted-activity-repository'

container.register<Storage>(STORAGE, { useValue: localStorage })
container.register<ToastType>(TOAST, { useValue: toast })
container.registerSingleton(VERSION_REPOSITORY, FakeVersionRepository)
container.registerSingleton(AUTH_REPOSITORY, FakeAuthRepository)
container.registerSingleton(USER_REPOSITORY, FakeUserRepository)
container.registerSingleton(USER_SETTINGS_REPOSITORY, FakeUserSettingsRepository)
container.registerSingleton(VACATION_REPOSITORY, FakeVacationRepository)
container.registerSingleton(HOLIDAY_REPOSITORY, FakeHolidayRepository)
container.registerSingleton(SEARCH_REPOSITORY, FakeSearchRepository)
container.registerSingleton(PROJECT_ROLE_REPOSITORY, FakeProjectRoleRepository)
container.registerSingleton(PROJECT_REPOSITORY, FakeProjectRepository)
container.registerSingleton(ORGANIZATION_REPOSITORY, FakeOrganizationRepository)
container.registerSingleton(ACTIVITY_REPOSITORY, FakeActivityRepository)
container.registerSingleton(ABSENCE_REPOSITORY, FakeAbsenceRepository)
container.registerSingleton(SUBCONTRACTED_ACTIVITY_REPOSITORY, FakeSubcontractedActivityRepository)

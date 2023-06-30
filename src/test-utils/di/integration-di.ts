import { container } from 'tsyringe'
import {
  ACTIVITY_REPOSITORY,
  ADMINISTRATION_PROJECT_REPOSITORY,
  AUTH_REPOSITORY,
  HOLIDAY_REPOSITORY,
  ORGANIZATION_REPOSITORY,
  PROJECT_REPOSITORY,
  PROJECT_ROLE_REPOSITORY,
  SEARCH_REPOSITORY,
  SHARED_USER_REPOSITORY,
  STORAGE,
  TOAST,
  USER_SETTINGS_REPOSITORY,
  VACATION_REPOSITORY,
  VERSION_REPOSITORY
} from '../../shared/di/container-tokens'
import { toast, ToastType } from '../../shared/di/container'
import { FakeVersionRepository } from '../../features/version/infrastructure/fake-version-repository'
import { FakeAuthRepository } from '../../features/auth/infrastructure/fake-auth-repository'
import { FakeUserRepository } from '../../features/shared/user/infrastructure/fake-user-repository'
import { LocalStorageUserSettingsRepository } from '../../features/shared/user/features/settings/infrastructure/local-storage-user-settings-repository'
import { FakeVacationRepository } from '../../features/binnacle/features/vacation/infrastructure/fake-vacation-repository'
import { FakeHolidayRepository } from '../../features/binnacle/features/holiday/infrastructure/fake-holiday-repository'
import { FakeSearchRepository } from '../../features/binnacle/features/search/infrastructure/fake-search-repository'
import { FakeProjectRoleRepository } from '../../features/binnacle/features/project-role/infrastructure/fake-project-role-repository'
import { FakeProjectRepository } from '../../features/binnacle/features/project/infrastructure/fake-project-repository'
import { FakeOrganizationRepository } from '../../features/binnacle/features/organization/infrastructure/fake-organization-repository'
import { FakeActivityRepository } from '../../features/binnacle/features/activity/infrastructure/fake-activity-repository'
import { FakeProjectRepository as FakeProjectRepositoryAdministration } from '../../features/administration/features/project/infrastructure/fake-project-repository'

export function injectIntegrationDependencies() {
  container.register<Storage>(STORAGE, { useValue: localStorage })
  container.register<ToastType>(TOAST, { useValue: toast })
  container.registerSingleton(VERSION_REPOSITORY, FakeVersionRepository)
  container.registerSingleton(AUTH_REPOSITORY, FakeAuthRepository)
  container.registerSingleton(SHARED_USER_REPOSITORY, FakeUserRepository)
  container.registerSingleton(USER_SETTINGS_REPOSITORY, LocalStorageUserSettingsRepository)
  container.registerSingleton(VACATION_REPOSITORY, FakeVacationRepository)
  container.registerSingleton(HOLIDAY_REPOSITORY, FakeHolidayRepository)
  container.registerSingleton(SEARCH_REPOSITORY, FakeSearchRepository)
  container.registerSingleton(PROJECT_ROLE_REPOSITORY, FakeProjectRoleRepository)
  container.registerSingleton(PROJECT_REPOSITORY, FakeProjectRepository)
  container.registerSingleton(ORGANIZATION_REPOSITORY, FakeOrganizationRepository)
  container.registerSingleton(ACTIVITY_REPOSITORY, FakeActivityRepository)
  container.registerSingleton(
    ADMINISTRATION_PROJECT_REPOSITORY,
    FakeProjectRepositoryAdministration
  )
}

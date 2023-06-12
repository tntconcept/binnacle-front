import { createStandaloneToast } from '@chakra-ui/react'
import { HttpProjectRepository as HttpAdministrationProjectRepository } from 'features/administration/features/project/infrastructure/http-project-repository'
import { HttpAuthRepository } from 'features/auth/infrastructure/http-auth-repository'
import { HttpActivityRepository } from 'features/binnacle/features/activity/infrastructure/http-activity-repository'
import { HttpHolidayRepository } from 'features/binnacle/features/holiday/infrastructure/http-holiday-repository'
import { HttpOrganizationRepository } from 'features/binnacle/features/organization/infrastructure/http-organization-repository'
import { HttpProjectRoleRepository } from 'features/binnacle/features/project-role/infrastructure/http-project-role-repository'
import { HttpProjectRepository } from 'features/binnacle/features/project/infrastructure/http-project-repository'
import { HttpSearchRepository } from 'features/binnacle/features/search/infrastructure/http-search-repository'
import { HttpVacationRepository } from 'features/binnacle/features/vacation/infrastructure/http-vacation-repository'
import { LocalStorageUserSettingsRepository } from 'features/shared/user/features/settings/infrastructure/local-storage-user-settings-repository'
import { HttpSharedUserRepository } from 'features/shared/user/infrastructure/http-user-repository'
import { HttpVersionRepository } from 'features/version/infrastructure/http-version-repository'
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
} from './container-tokens'

export const toast = createStandaloneToast()
export type ToastType = typeof toast

container.register<Storage>(STORAGE, { useValue: localStorage })
container.register<ToastType>(TOAST, { useValue: toast })
container.registerSingleton(VERSION_REPOSITORY, HttpVersionRepository)
container.registerSingleton(AUTH_REPOSITORY, HttpAuthRepository)
container.registerSingleton(SHARED_USER_REPOSITORY, HttpSharedUserRepository)
container.registerSingleton(USER_SETTINGS_REPOSITORY, LocalStorageUserSettingsRepository)
container.registerSingleton(VACATION_REPOSITORY, HttpVacationRepository)
container.registerSingleton(HOLIDAY_REPOSITORY, HttpHolidayRepository)
container.registerSingleton(SEARCH_REPOSITORY, HttpSearchRepository)
container.registerSingleton(PROJECT_ROLE_REPOSITORY, HttpProjectRoleRepository)
container.registerSingleton(PROJECT_REPOSITORY, HttpProjectRepository)
container.registerSingleton(ORGANIZATION_REPOSITORY, HttpOrganizationRepository)
container.registerSingleton(ACTIVITY_REPOSITORY, HttpActivityRepository)
container.registerSingleton(ADMINISTRATION_PROJECT_REPOSITORY, HttpAdministrationProjectRepository)

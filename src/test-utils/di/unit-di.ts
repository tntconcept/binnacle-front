import 'reflect-metadata'
import { createStandaloneToast } from '@chakra-ui/react'
import { ProjectRepository } from '../../features/administration/features/project/domain/project-repository'
import { AuthRepository } from '../../features/auth/domain/auth-repository'
import { ActivityRepository } from '../../features/binnacle/features/activity/domain/activity-repository'
import { OrganizationRepository } from '../../features/binnacle/features/organization/domain/organization-repository'
import { SharedUserRepository } from '../../features/shared/user/domain/shared-user-repository'
import { UserSettingsRepository } from '../../features/shared/user/features/settings/domain/user-settings-repository'
import { mock } from 'jest-mock-extended'
import { container } from 'tsyringe'
import {
  ACTIVITY_REPOSITORY,
  ADMINISTRATION_PROJECT_REPOSITORY,
  AUTH_REPOSITORY,
  ORGANIZATION_REPOSITORY,
  SHARED_USER_REPOSITORY,
  TOAST,
  USER_SETTINGS_REPOSITORY
} from '../../shared/di/container-tokens'

export const toast = createStandaloneToast()
export type ToastType = typeof toast

container.register<ToastType>(TOAST, { useValue: toast })
container.register(USER_SETTINGS_REPOSITORY, { useValue: mock<UserSettingsRepository>() })
container.register(AUTH_REPOSITORY, { useValue: mock<AuthRepository>() })
container.register(SHARED_USER_REPOSITORY, { useValue: mock<SharedUserRepository>() })
container.register(ORGANIZATION_REPOSITORY, { useValue: mock<OrganizationRepository>() })
container.register(ADMINISTRATION_PROJECT_REPOSITORY, { useValue: mock<ProjectRepository>() })
container.register(ACTIVITY_REPOSITORY, { useValue: mock<ActivityRepository>() })

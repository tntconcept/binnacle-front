import 'reflect-metadata'
import { AuthRepository } from '../../features/auth/domain/auth-repository'
import { ActivityRepository } from '../../features/binnacle/features/activity/domain/activity-repository'
import { OrganizationRepository } from '../../features/binnacle/features/organization/domain/organization-repository'
import { UserRepository } from '../../features/shared/user/domain/user-repository'
import { UserSettingsRepository } from '../../features/shared/user/features/settings/domain/user-settings-repository'
import { mock } from 'jest-mock-extended'
import { container } from 'tsyringe'
import {
  ACTIVITY_REPOSITORY,
  SUBCONTRACTED_ACTIVITY_REPOSITORY,
  AUTH_REPOSITORY,
  ORGANIZATION_REPOSITORY,
  PROJECT_REPOSITORY,
  TOAST,
  USER_REPOSITORY,
  USER_SETTINGS_REPOSITORY
} from '../../shared/di/container-tokens'
import { toast, ToastType } from '../../shared/notification/toast'
import { ProjectRepository } from '../../features/shared/project/domain/project-repository'
import { SubcontractedActivityRepository } from '../../features/binnacle/features/activity/domain/subcontracted-activity-repository'

container.register<ToastType>(TOAST, { useValue: toast })
container.register(USER_SETTINGS_REPOSITORY, { useValue: mock<UserSettingsRepository>() })
container.register(AUTH_REPOSITORY, { useValue: mock<AuthRepository>() })
container.register(USER_REPOSITORY, { useValue: mock<UserRepository>() })
container.register(ORGANIZATION_REPOSITORY, { useValue: mock<OrganizationRepository>() })
container.register(PROJECT_REPOSITORY, { useValue: mock<ProjectRepository>() })
container.register(ACTIVITY_REPOSITORY, { useValue: mock<ActivityRepository>() })
container.register(SUBCONTRACTED_ACTIVITY_REPOSITORY, {
  useValue: mock<SubcontractedActivityRepository>()
})

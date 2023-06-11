import { UserSettings } from './user-settings'

export interface UserSettingsRepository {
  get(): UserSettings
  save(settings: UserSettings): void
}

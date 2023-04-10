import { UserSettings } from './user-settings'

export interface UserSettingsRepository {
  get(): Promise<UserSettings>
  save(settings: UserSettings): Promise<void>
}

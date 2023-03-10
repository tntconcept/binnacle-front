import { action, makeObservable, observable } from 'mobx'
import { STORAGE } from 'shared/data-access/ioc-container/ioc-container.tokens'
import type { SettingsValues } from 'shared/data-access/state/SettingsValues.interface'
import { inject, singleton } from 'tsyringe'

export const STORAGE_KEY = '_binnacle_settings_'

export const initialSettings: SettingsValues = {
  isSystemTheme: true,
  autofillHours: true,
  hoursInterval: {
    startWorkingTime: '09:00',
    startLunchBreak: '13:00',
    endLunchBreak: '14:00',
    endWorkingTime: '18:00'
  },
  showDurationInput: false,
  useDecimalTimeFormat: false,
  showDescription: true
}

@singleton()
export class SettingsState {
  @observable.ref
  settings: SettingsValues = initialSettings

  constructor(@inject(STORAGE) private storage: Storage) {
    makeObservable(this)

    this.loadFromStorageIfAvailable()
  }

  @action.bound
  private loadFromStorageIfAvailable() {
    const persistedSettings = JSON.parse(this.storage.getItem(STORAGE_KEY) || 'null')

    if (persistedSettings !== null) {
      this.settings = persistedSettings
    }
  }

  @action.bound
  saveSettings(values: SettingsValues) {
    this.settings = values
    this.storage.setItem(STORAGE_KEY, JSON.stringify(values))
  }
}

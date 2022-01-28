import { StoresDevtools } from './stores-devtools'
import { container } from 'tsyringe'
import { AppState } from 'shared/data-access/state/app-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import { VacationsState } from 'modules/vacations/data-access/state/vacations-state'
import { isObservable, runInAction } from 'mobx'
import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'

// init all stores
export const storesDevtools = new StoresDevtools()
storesDevtools.addStore(AppState.name, container.resolve(AppState))
storesDevtools.addStore(BinnacleState.name, container.resolve(BinnacleState))
storesDevtools.addStore(ActivityFormState.name, container.resolve(ActivityFormState))
storesDevtools.addStore(VacationsState.name, container.resolve(VacationsState))
storesDevtools.addStore(SettingsState.name, container.resolve(SettingsState))

export const displayActionWithinReduxDevtools = () => {
  const initialState = storesDevtools.stores

  let extension: any

  try {
    extension = (window as any).__REDUX_DEVTOOLS_EXTENSION__
  } catch {}

  if (!extension) {
    if (
      typeof process === 'object' &&
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined'
    ) {
      // eslint-disable-next-line no-console
      console.warn('[Warning] Please install/enable Redux devtools extension')
    }
    return () => {}
  }

  const devtools = extension.connect({ name: 'Mobx actions logger' })

  let isTimeTraveling = false

  const logAction = (name: string, params: any) => {
    if (isTimeTraveling) {
      isTimeTraveling = false
    } else {
      devtools.send(
        {
          type: name,
          payload: params
        },
        storesDevtools.stores
      )
    }
  }

  devtools.subscribe((message: { type: string; payload?: any; state?: any }) => {
    if (message.type === 'DISPATCH' && message.state) {
      if (message.payload?.type === 'JUMP_TO_ACTION' || message.payload?.type === 'JUMP_TO_STATE') {
        isTimeTraveling = true
      }

      runInAction(() => {
        const nextState = JSON.parse(message.state)
        Object.keys(nextState).forEach((key) => {
          Object.keys(storesDevtools.stores[key]).forEach((property) => {
            if (isObservable(storesDevtools.stores[key][property])) {
              storesDevtools.stores[key][property] = nextState[key][property]
            }
          })
        })
      })
    } else if (message.type === 'DISPATCH' && message.payload?.type === 'COMMIT') {
      devtools.init(storesDevtools.stores)
    }
  })

  devtools.init(initialState)

  return logAction
}

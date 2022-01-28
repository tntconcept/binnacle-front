import type { InjectionToken } from 'tsyringe'
import { container } from 'tsyringe'

export function useGlobalState<T>(state: InjectionToken<T>) {
  return container.resolve<T>(state)
}

import { makeObservable, observable } from 'mobx'
import type { User } from 'shared/api/users/User'
import { singleton } from 'tsyringe'

@singleton()
export class AppState {
  @observable
  isAuthenticated = false

  @observable.ref
  loggedUser?: User = undefined

  @observable.ref
  apiVersion?: string = undefined

  constructor() {
    makeObservable(this)
  }
}

import { makeObservable, observable } from 'mobx'
import type { User } from 'shared/api/users/User'
import { singleton } from 'tsyringe'

@singleton()
export class AppState {
  @observable
  isAuthenticated: boolean = false

  @observable.ref
  loggedUser?: User = undefined

  constructor() {
    makeObservable(this)
  }
}

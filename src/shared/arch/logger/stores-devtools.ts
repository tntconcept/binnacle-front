import { isObservable } from 'mobx'

export class StoresDevtools {
  stores: Record<string, any> = {}

  addStore(name: string, value: any) {
    if (isObservable(value)) {
      this.stores[name] = value
    } else {
      throw new Error(`Class ${name}, is not an observable.`)
    }
  }
}

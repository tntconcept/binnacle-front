export interface ISuspenseAPI<V> {
  read: () => V;
}

export function wrapPromise<V>(promise: Promise<V>): ISuspenseAPI<V> {
  let status = "pending"
  let result: V | Error
  let suspender = promise.then(
    r => {
      status = "success"
      result = r as V
    },
    e => {
      status = "error"
      result = e as Error
    }
  )

  return {
    read() {
      if (status === "pending") {
        throw suspender
      } else if (status === "error") {
        throw result
      } else if (status === "success") {
        return result as V
      } else {
        // never enters here is just to avoid typescript type error
        return result as V
      }
    }
  }
}
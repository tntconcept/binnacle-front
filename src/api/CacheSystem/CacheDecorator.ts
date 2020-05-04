import {MemoryCacheStore} from "api/CacheSystem/MemoryCacheStore"

export function CacheMethod(key: string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    // Save a copy of the method being decorated
    const originalMethod = descriptor.value
    descriptor.value = function (...args: Array<any>): Promise<any> {
      const completeKey =
        key +
        "_" +
        args
          .map(arg => (arg instanceof Date ? arg.toISOString() : arg))
          .join("_")
      console.log(completeKey, MemoryCacheStore.getSize())

      if (MemoryCacheStore.hasKey(completeKey)) {
        return MemoryCacheStore.getKey(completeKey)
      }

      return MemoryCacheStore.setKey(
        completeKey,
        new Promise<any>(async resolve => {
          resolve(originalMethod.apply(this, args))
        })
      )
    }

    return descriptor
  }
}
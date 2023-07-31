import { UseCase } from '@archimedes/arch'
import { DependencyList, useEffect } from 'react'
import { constructor } from 'tsyringe/dist/typings/types'
import { useResolve } from '../../di/use-resolve'

export function useSubscribeToUseCase<Param, Result>(
  queryToken: constructor<UseCase<Result, Param>>,
  fn = () => {},
  deps?: DependencyList
) {
  const useCase = useResolve(queryToken)

  useEffect(() => {
    const subscriptionId = useCase.subscribe(fn)

    return () => useCase.unsubscribe(subscriptionId)
  }, [useCase, deps, fn])

  return { useCase }
}

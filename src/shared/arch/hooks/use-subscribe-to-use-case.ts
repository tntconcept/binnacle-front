import { UseCase } from '@archimedes/arch'
import { DependencyList, useEffect } from 'react'
import { useResolve } from 'shared/di/use-resolve'
import { constructor } from 'tsyringe/dist/typings/types'

export function useSubscribeToUseCase<Param, Result>(
  queryToken: constructor<UseCase<Result, Param>>,
  fn = () => {},
  deps?: DependencyList
) {
  const useCase = useResolve(queryToken)

  useEffect(() => {
    const subscriptionId = useCase.subscribe(fn)

    return () => useCase.unsubscribe(subscriptionId)
  }, [useCase, deps])

  return { useCase }
}

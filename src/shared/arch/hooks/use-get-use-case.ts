import { ExecutionOptions, UseCase } from '@archimedes/arch'
import { useCallback, useEffect, useRef, useState } from 'react'
import { constructor } from 'tsyringe/dist/typings/types'
import { useResolve } from '../../di/use-resolve'

export function useGetUseCase<Param, Result>(queryToken: constructor<UseCase<Result, Param>>) {
  const [isLoading, setIsLoading] = useState(true)
  const useCase = useResolve(queryToken)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    setIsLoading(false)
    return () => {
      isMounted.current = false
    }
  }, [])

  const executeUseCase = useCallback(
    async (param: Param, options?: ExecutionOptions): Promise<Result> => {
      isMounted.current && setIsLoading(true)
      return useCase.execute(param, options).finally(() => isMounted.current && setIsLoading(false))
    },
    [useCase]
  )

  return { isLoading, executeUseCase, useCase }
}

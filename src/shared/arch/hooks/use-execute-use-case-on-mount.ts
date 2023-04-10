import { ExecutionOptions, UseCase } from '@archimedes/arch'
import isEqual from 'lodash/isEqual'
import { useEffect, useRef, useState } from 'react'
import { useResolve } from 'shared/di/use-resolve'
import { constructor } from 'tsyringe/dist/typings/types'

export function useExecuteUseCaseOnMount<Param, Result>(
  queryToken: constructor<UseCase<Result, Param>>,
  param: Param = undefined!,
  options?: ExecutionOptions
) {
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<Result>()
  const useCase = useResolve(queryToken)

  const previousParam = useRef<Param | null>(null)

  const executeUseCase = async (param: Param) => {
    try {
      setIsLoading(true)
      const response = await useCase.execute(param, options)
      setResult(response)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isEqual(previousParam.current, param)) {
      previousParam.current = param
      executeUseCase(param)
    }
  }, [useCase, param])

  return { isLoading, result, useCase, executeUseCase }
}

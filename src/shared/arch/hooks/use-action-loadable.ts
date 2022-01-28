import { useCallback, useEffect, useRef, useState } from 'react'
import { useAction } from 'shared/arch/hooks/use-action'
import type { IAction, IActionOptions } from 'shared/arch/interfaces/IAction'
import type { InjectionToken } from 'tsyringe'

export const useActionLoadable = <Param>(
  action: InjectionToken<IAction<Param>>,
  options?: IActionOptions & { initialLoading?: boolean },
) => {
  const [isLoading, setIsLoading] = useState(options?.initialLoading ?? false)
  const execute = useAction(action, options)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleExecute = useCallback(
    async (param: Param) => {
      try {
        isMounted.current && setIsLoading(true)
        await execute(param)
        isMounted.current && setIsLoading(false)
      } catch (e) {
        isMounted.current && setIsLoading(false)
        throw e
      }

    },
    [execute]
  )

  return [handleExecute, isLoading] as const
}

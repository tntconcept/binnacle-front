import isEqual from 'lodash/isEqual'
import { useEffect, useRef } from 'react'
import type { InjectionToken } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { useActionLoadable } from './use-action-loadable'

export function useActionOnMount<Param>(
  action: InjectionToken<IAction<Param>>,
  param: Param = undefined!
) {
  const [executeAction, isLoading] = useActionLoadable(action, { initialLoading: true })

  const previousParam = useRef<Param | null>(null)

  useEffect(() => {
    if (!isEqual(previousParam.current, param)) {
      previousParam.current = param
      executeAction(param)
    }
  }, [executeAction, param])

  return isLoading
}

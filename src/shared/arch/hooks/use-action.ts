import { useCallback, useRef } from 'react'
import type { IAction, IActionOptions } from 'shared/arch/interfaces/IAction'
import type { InjectionToken } from 'tsyringe'
import { container } from 'tsyringe'
import { useShowErrorNotification } from 'shared/components/Notifications/useShowErrorNotification'

const defaultOptions: IActionOptions = {
  showAlertError: true
}

export function useAction<Param>(
  action: InjectionToken<IAction<Param>>,
  options: Partial<IActionOptions> = defaultOptions
) {
  const actionInstance = container.resolve(action)
  const showErrorNotification = useShowErrorNotification()
  const optionsRef = useRef({ ...defaultOptions, ...options })

  return useCallback(
    async (param: Param = undefined!) => {
      const { showAlertError } = optionsRef.current

      try {
        await actionInstance.execute(param)
      } catch (error) {
        if (typeof showAlertError == 'boolean' && showAlertError) {
          showErrorNotification(error)
        }

        if (typeof showAlertError === 'function') {
          const overrideMessage = showAlertError(error)
          showErrorNotification(error, overrideMessage)
        }

        throw error
      }
    },
    [actionInstance, showErrorNotification]
  )
}

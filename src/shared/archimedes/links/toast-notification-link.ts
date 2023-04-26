import { BaseLink, Context } from '@archimedes/arch'
import type { ToastType } from 'shared/di/container'
import { TOAST } from 'shared/di/container-tokens'
import { inject } from 'tsyringe'

export class ToastNotificationLink extends BaseLink {
  constructor(@inject(TOAST) private toast: ToastType) {
    super()
  }

  async next(context: Context): Promise<void> {
    context.result = context.result
      ?.then((x) => {
        if (context.executionOptions?.successMessage)
          this.toast({
            title: context.executionOptions.successMessage,
            status: 'success',
            duration: 10000,
            isClosable: true,
            position: 'top-right'
          })

        return x
      })
      .catch((error) => {
        if (!context.executionOptions?.showAlertError) {
          console.error(error)
          throw error
        }

        this.toast({
          status: 'error',
          title: context.executionOptions.errorMessage,
          duration: 10000,
          isClosable: true,
          position: 'top-right'
        })

        throw error
      })

    await this.nextLink.next(context)
  }
}

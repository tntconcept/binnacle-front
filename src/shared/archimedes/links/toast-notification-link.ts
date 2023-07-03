import { BaseLink, Context } from '@archimedes/arch'
import type { ToastType } from 'shared/di/container'
import { TOAST } from 'shared/di/container-tokens'
import { i18n } from 'shared/i18n/i18n'
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
        if (!context.executionOptions?.showToastError) {
          console.error(error)
          throw error
        }

        if (typeof context.executionOptions.errorMessage === 'string') {
          this.toast({
            status: 'error',
            title: context.executionOptions.errorMessage,
            duration: 10000,
            isClosable: true,
            position: 'top-right'
          })
        }

        if (typeof context.executionOptions.errorMessage === 'function') {
          const { code, data } = error.response.data
          const { title, description } = context.executionOptions.errorMessage(code, data)

          this.toast({
            status: 'error',
            title: title || i18n.t('api_errors.unknown'),
            description: description,
            containerStyle: {
              whiteSpace: 'pre-wrap'
            },
            duration: 10000,
            isClosable: true,
            position: 'top-right'
          })
        }

        throw error
      })

    await this.nextLink.next(context)
  }
}

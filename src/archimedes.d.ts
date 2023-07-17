import '@archimedes/arch'
import { NotificationMessage } from './shared/notification/notification-message'

declare module '@archimedes/arch' {
  type ErrorFunction = (code: string, data?: unknown) => NotificationMessage

  interface ExecutionOptions {
    errorMessage?: string | ErrorFunction
    successMessage?: string
    showLoading?: boolean
    showToastError?: boolean
  }
}

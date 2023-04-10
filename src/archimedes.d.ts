import '@archimedes/arch'

declare module '@archimedes/arch' {
  interface ExecutionOptions {
    errorMessage?: string
    successMessage?: string
    showLoading?: boolean
    showAlertError?: boolean
  }
}

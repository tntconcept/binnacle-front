import { createStandaloneToast } from '@chakra-ui/react'
import { SessionTokenStorage } from 'shared/api/oauth/token-storage/session-token-storage'
import type { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'
import { STORAGE, TOAST } from 'shared/data-access/ioc-container/ioc-container.types'
import { container } from 'tsyringe'

export const toast = createStandaloneToast()
export type ToastType = typeof toast

export function registerValueProviders() {
  container.register<Storage>(STORAGE, { useValue: localStorage })
  container.register<ToastType>(TOAST, { useValue: toast })

  // https://github.com/microsoft/tsyringe#instancecachingfactory
  container.register<TokenStorage>('TokenStorage', {
    useValue: new SessionTokenStorage(sessionStorage)
  })
}

registerValueProviders()

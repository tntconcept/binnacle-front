import { createStandaloneToast } from '@chakra-ui/react'
import type { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'
import { STORAGE, TOAST } from 'shared/data-access/ioc-container/ioc-container.types'
import { container, instanceCachingFactory } from 'tsyringe'
import { SessionTokenStorage } from 'shared/api/oauth/token-storage/session-token-storage'
import { MemoryTokenStorage } from 'shared/api/oauth/token-storage/memory-token-storage'

export const toast = createStandaloneToast()
export type ToastType = typeof toast

export function registerValueProviders() {
  container.register<Storage>(STORAGE, { useValue: localStorage })
  container.register<ToastType>(TOAST, { useValue: toast })

  // https://github.com/microsoft/tsyringe#instancecachingfactory
  container.register<TokenStorage>('TokenStorage', {
    useFactory: instanceCachingFactory<TokenStorage>((c) => {
      const isCypress = window.Cypress !== undefined

      if (isCypress) {
        return c.resolve(SessionTokenStorage)
      } else {
        return c.resolve(MemoryTokenStorage)
      }
    })
  })
}

registerValueProviders()

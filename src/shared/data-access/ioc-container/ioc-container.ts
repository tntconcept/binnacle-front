import { createStandaloneToast } from '@chakra-ui/react'
import { STORAGE, TOAST } from 'shared/data-access/ioc-container/ioc-container.types'
import { container } from 'tsyringe'

export const toast = createStandaloneToast()
export type ToastType = typeof toast

export function registerValueProviders() {
  container.register<Storage>(STORAGE, { useValue: localStorage })
  container.register<ToastType>(TOAST, { useValue: toast })
}

registerValueProviders()

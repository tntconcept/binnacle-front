import { createStandaloneToast } from '@chakra-ui/react'
import { HttpActivityRepository } from 'modules/binnacle/data-access/repositories/http-activity-repository'
import {
  ACTIVITY_REPOSITORY,
  STORAGE,
  TOAST
} from 'shared/data-access/ioc-container/ioc-container.tokens'
import { container } from 'tsyringe'

export const toast = createStandaloneToast()
export type ToastType = typeof toast

export function registerValueProviders() {
  container.register<Storage>(STORAGE, { useValue: localStorage })
  container.register<ToastType>(TOAST, { useValue: toast })
  container.registerSingleton(ACTIVITY_REPOSITORY, HttpActivityRepository)
}

registerValueProviders()

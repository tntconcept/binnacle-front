import { createStandaloneToast } from '@chakra-ui/react'
import { HttpActivityRepository } from 'modules/binnacle/data-access/repositories/http-activity-repository'
import { HttpVacationsRepository } from 'modules/vacations/data-access/repositories/http-vacations-repository'
import {
  ACTIVITY_REPOSITORY,
  STORAGE,
  TOAST,
  VACATIONS_REPOSITORY
} from 'shared/data-access/ioc-container/ioc-container.tokens'
import { container } from 'tsyringe'

export const toast = createStandaloneToast()
export type ToastType = typeof toast

export function registerValueProviders() {
  container.register<Storage>(STORAGE, { useValue: localStorage })
  container.register<ToastType>(TOAST, { useValue: toast })
  container.registerSingleton(ACTIVITY_REPOSITORY, HttpActivityRepository)
  container.registerSingleton(VACATIONS_REPOSITORY, HttpVacationsRepository)
}

registerValueProviders()

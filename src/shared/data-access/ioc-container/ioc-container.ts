import { createStandaloneToast } from '@chakra-ui/react'
import { HttpActivityRepository } from 'modules/binnacle/data-access/repositories/http-activity-repository'
import { HttpCombosRepository } from 'modules/binnacle/data-access/repositories/http-combos-repository'
import { HttpHolidaysRepository } from 'modules/binnacle/data-access/repositories/http-holidays-repository'
import { HttpSearchRepository } from 'modules/binnacle/data-access/repositories/http-search-repository'
import { HttpApiVersionRepository } from 'modules/login/data-access/repositories/http-api-version-repository'
import { HttpUserRepository } from 'modules/login/data-access/repositories/http-user-repository'
import { HttpVacationsRepository } from 'modules/vacations/data-access/repositories/http-vacations-repository'
import {
  ACTIVITY_REPOSITORY,
  API_VERSION_REPOSITORY,
  COMBOS_REPOSITORY,
  HOLIDAYS_REPOSITORY,
  SEARCH_REPOSITORY,
  STORAGE,
  TOAST,
  USER_REPOSITORY,
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
  container.registerSingleton(HOLIDAYS_REPOSITORY, HttpHolidaysRepository)
  container.registerSingleton(SEARCH_REPOSITORY, HttpSearchRepository)
  container.registerSingleton(USER_REPOSITORY, HttpUserRepository)
  container.registerSingleton(API_VERSION_REPOSITORY, HttpApiVersionRepository)
  container.registerSingleton(COMBOS_REPOSITORY, HttpCombosRepository)
}

registerValueProviders()

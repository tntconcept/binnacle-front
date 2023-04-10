import type { constructor } from 'tsyringe/dist/typings/types'
import { resolve } from './resolve'
import { useMemo } from 'react'

export function useResolve<T>(token: constructor<T> | string | symbol) {
  return useMemo(() => resolve(token), [token])
}

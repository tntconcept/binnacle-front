import { cls } from './helpers'
import { it, expect } from 'vitest'

it('should conditionally join classes', () => {
  expect(cls('base', false && 'never', true && 'test')).toBe('base test')
})

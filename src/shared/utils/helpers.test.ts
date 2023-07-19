import { cls } from './helpers'

test('should conditionally join classes', () => {
  expect(cls('base', false && 'never', true && 'test')).toBe('base test')
})

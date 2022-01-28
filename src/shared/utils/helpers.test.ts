import { cls } from 'shared/utils/helpers'

test('should conditionally join classes', () => {
  expect(cls('base', false && 'never', true && 'test')).toBe('base test')
})

import { cls, rem, roundToTwoDecimals } from 'utils/helpers'

test('should parse px to rem', () => {
  expect(rem('16px')).toEqual('1rem')
  expect(rem('32px')).toEqual('2rem')
  expect(rem('18px')).toEqual('1.125rem')
})

test('should conditionally join classes', () => {
  expect(cls('base', false && 'never', true && 'test')).toBe('base test')
})

test('should round to two decimals', () => {
  expect(roundToTwoDecimals(3.254)).toBe(3.25)
  expect(roundToTwoDecimals(3.255)).toBe(3.26)
  expect(roundToTwoDecimals(3.258)).toBe(3.26)
})

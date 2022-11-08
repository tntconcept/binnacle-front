import { capitalize } from './capitalize'

describe('capitalize', () => {
  it('Should return a string with the first letter capitalized if the string is only one word', () => {
    expect(capitalize('hello')).toBe('Hello')
  })
})

import { getParamsSerializer } from './get-params-serializer'

describe('getParamsSerializer', () => {
  it('should serialize array param', () => {
    const actual = getParamsSerializer({
      foo: [1, 2]
    })

    expect(actual).toBe('foo=1%2C2')
  })

  it('should serialize string param', () => {
    const actual = getParamsSerializer({
      foo: 'bar'
    })

    expect(actual).toBe('foo=bar')
  })

  it('should serialize multiple params', () => {
    const actual = getParamsSerializer({
      foo: [1, 2],
      bar: 'bar'
    })

    expect(actual).toBe('foo=1%2C2&bar=bar')
  })
})

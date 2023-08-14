import { describe, expect, it } from 'vitest'

describe('Timezone test execution', () => {
  it('should use UTC as the timezone', () => {
    expect(new Date().getTimezoneOffset()).toBe(0)
  })
})

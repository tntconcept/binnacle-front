import { PercentageFormatter } from './percentage-formatter'
import { i18n } from '../i18n/i18n'

describe('PercentageFormatter', () => {
  test.each`
    value      | locale  | result
    ${12}      | ${'es'} | ${'12,0 %'}
    ${12.5}    | ${'es'} | ${'12,5 %'}
    ${12.1256} | ${'es'} | ${'12,13 %'}
    ${40.112}  | ${'es'} | ${'40,11 %'}
    ${12}      | ${'en'} | ${'12.0%'}
    ${12.5}    | ${'en'} | ${'12.5%'}
    ${12.1256} | ${'en'} | ${'12.13%'}
    ${40.112}  | ${'en'} | ${'40.11%'}
  `("should return '$result' for $value and locale $locale", ({ value, result, locale }) => {
    i18n.language = locale
    const percentageText = PercentageFormatter.format(value)

    expect(percentageText).toBe(result)
  })
})

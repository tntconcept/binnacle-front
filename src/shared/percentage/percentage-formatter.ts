import i18n from 'shared/i18n/i18n'

export class PercentageFormatter {
  static format(value: number) {
    const result = Intl.NumberFormat(i18n.language, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value / 100)

    return result
  }
}

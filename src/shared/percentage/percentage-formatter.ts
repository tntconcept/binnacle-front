import { i18n } from 'shared/i18n/i18n'

export class PercentageFormatter {
  static format(value: number) {
    return Intl.NumberFormat(i18n.language, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value / 100)
  }
}

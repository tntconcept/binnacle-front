import { YearBalance } from 'modules/binnacle/data-access/interfaces/year-balance.interface'
import { getDurationByHours } from 'modules/binnacle/data-access/utils/getDuration'
import { SettingsValues } from 'shared/data-access/state/SettingsValues.interface'
import i18n from 'shared/i18n/i18n'
import { PercentageFormatter } from 'shared/percentage/percentage-formatter'
import { getMonthNames } from 'shared/utils/chrono'

export const getTooltipTitle = (tooltipItems: any) => {
  const monthNames = getMonthNames()

  if (tooltipItems.length === 0) return

  const dataIndex = tooltipItems.at(0).dataIndex
  return monthNames[dataIndex]
}

export const getTooltipLabel = (
  context: { label: any; dataIndex: any; dataset: any; type: any },
  settings: SettingsValues
) => {
  const { dataIndex, dataset } = context
  const isRecommendedDataset = dataset.type === 'line'
  if (isRecommendedDataset)
    return [
      dataset.label,
      getDurationByHours(dataset.data[dataIndex].y, settings.useDecimalTimeFormat),
      ''
    ]

  const { percentage, y: value, isVacation = false } = dataset.data[dataIndex]
  if (isVacation) {
    if (value === 0) return ''

    return [
      i18n.t('vacations'),
      `${getDurationByHours(value, settings.useDecimalTimeFormat)} - ${PercentageFormatter.format(
        percentage
      )}`,
      ''
    ]
  }

  const { organization, project, role } = dataset.data[dataIndex]

  if (value === 0) return ''
  return [
    organization,
    project,
    role,
    `${getDurationByHours(value, settings.useDecimalTimeFormat)} - ${PercentageFormatter.format(
      percentage
    )}`,
    ''
  ]
}

export const getTooltipAfterBody = (
  tooltipItems: any[],
  yearBalance: YearBalance,
  settings: SettingsValues
) => {
  if (tooltipItems.length === 0) return

  const dataIndex = tooltipItems.at(0).dataIndex
  const { worked, balance } = yearBalance.months[dataIndex]
  return [
    `${i18n.t('year_balance.worked')}: ${getDurationByHours(
      worked,
      settings.useDecimalTimeFormat
    )}`,
    `${i18n.t('year_balance.balance')}: ${getDurationByHours(
      balance,
      settings.useDecimalTimeFormat,
      true
    )}`
  ]
}

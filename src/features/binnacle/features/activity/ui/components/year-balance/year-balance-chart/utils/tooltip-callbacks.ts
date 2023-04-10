import { YearBalance } from 'features/binnacle/features/activity/domain/year-balance'
import { getDurationByHours } from 'features/binnacle/features/activity/utils/getDuration'
import i18n from 'shared/i18n/i18n'
import { PercentageFormatter } from 'shared/percentage/percentage-formatter'
import { getMonthNames } from 'shared/utils/chrono'
import { RolesDatasetData, VacationsDatasetData } from '../types/dataset-data'
import { TooltipItem } from '../types/tooltip-item'
import { TooltipLabelContext } from '../types/tooltip-label-context'

export const getTooltipTitle = (tooltipItems: TooltipItem[]) => {
  const monthNames = getMonthNames()

  if (tooltipItems.length === 0) return

  const dataIndex = tooltipItems.at(0)!.dataIndex
  return monthNames[dataIndex]
}

export const getTooltipLabel = (context: TooltipLabelContext, useDecimalTimeFormat: boolean) => {
  const { dataIndex, dataset } = context
  const isRecommendedDataset = dataset.type === 'line'
  if (isRecommendedDataset)
    return [
      ' ' + dataset.label,
      ' ' + getDurationByHours(dataset.data[dataIndex].y, useDecimalTimeFormat),
      ''
    ]

  const {
    percentage,
    y: value,
    isVacation = false
  } = dataset.data[dataIndex] as VacationsDatasetData
  if (isVacation) {
    if (value === 0) return ''

    return [
      ' ' + i18n.t('vacations'),
      ` ${getDurationByHours(value, useDecimalTimeFormat)} - ${PercentageFormatter.format(
        percentage
      )}`,
      ''
    ]
  }

  const { organization, project, role } = dataset.data[dataIndex] as RolesDatasetData

  if (value === 0) return ''
  return [
    ' ' + organization,
    ' ' + project,
    ' ' + role,
    ` ${getDurationByHours(value, useDecimalTimeFormat)} - ${PercentageFormatter.format(
      percentage
    )}`,
    ''
  ]
}

export const getTooltipAfterBody = (
  tooltipItems: TooltipItem[],
  yearBalance: YearBalance,
  useDecimalTimeFormat: boolean
) => {
  if (tooltipItems.length === 0) return

  const dataIndex = tooltipItems.at(0)!.dataIndex
  const { worked, balance } = yearBalance.months[dataIndex]
  return [
    `${i18n.t('year_balance.worked')}: ${getDurationByHours(worked, useDecimalTimeFormat)}`,
    `${i18n.t('year_balance.balance')}: ${getDurationByHours(balance, useDecimalTimeFormat, true)}`
  ]
}

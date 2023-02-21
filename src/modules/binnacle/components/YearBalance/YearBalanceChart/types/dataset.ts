import { YearBalanceDatasetData } from './dataset-data'

export type Dataset = {
  data: YearBalanceDatasetData[]
  type: 'line' | 'bar'
  label: string | string[]
  backgroundColor?: string
  borderColor?: string
  fill?: boolean
}

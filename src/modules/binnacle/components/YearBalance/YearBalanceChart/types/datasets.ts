export type CommonDatasetData = {
  x: number
  y: number
}

export type RecommendedDatasetData = CommonDatasetData

export type RolesDatasetData = CommonDatasetData & {
  organization: string
  project: string
  role: string
  percentage: number
  isVacation: false
}

export type VacationsDatasetData = CommonDatasetData & {
  isVacation: true
}

export type YearBalanceDatasetData =
  | RecommendedDatasetData
  | RolesDatasetData
  | VacationsDatasetData

import { OrganizationType } from './organization-type'

export interface OrganizationFilters {
  imputable: boolean
  types?: OrganizationType[]
}

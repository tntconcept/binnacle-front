export const OrganizationTypes = {
  CLIENT: 'CLIENT',
  PROVIDER: 'PROVIDER',
  PROSPECT: 'PROSPECT'
}

export type OrganizationType = keyof typeof OrganizationTypes

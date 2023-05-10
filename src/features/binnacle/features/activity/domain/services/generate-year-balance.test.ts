import {
  buildLiteProjectRoleWithProjectId,
  buildLiteProjectWithOrganizationId,
  buildSearchRolesResponse,
  buildYearBalanceMonth,
  buildYearBalanceRole,
  mockTimeSummary
} from 'test-utils/generateTestMocks'
import { YearBalancePerMonth, YearBalanceRoles } from '../year-balance'
import { GenerateYearBalance } from './generate-year-balance'

describe('GenerateYearBalance', () => {
  describe('getAnnualBalancePerMonth', () => {
    it('should generate an empty monthly balance', async () => {
      const { generateYearBalance } = setup()
      const emptyTimeSummary = mockTimeSummary()
      const expectedResult: YearBalancePerMonth[] = new Array(12).fill({
        balance: 0,
        recommended: 0,
        worked: 0,
        vacations: {
          hours: 0,
          percentage: 0
        },
        total: 0
      } as YearBalancePerMonth)

      const result = generateYearBalance['getAnnualBalancePerMonth'](emptyTimeSummary)

      expect(result).toEqual(expectedResult)
    })

    it('should generate monthly balance when time summary has months with data', async () => {
      const { generateYearBalance } = setup()
      const timeSummary = mockTimeSummary({
        months: [
          {
            workable: 150,
            worked: 0,
            balance: 100,
            recommended: 110,
            vacation: 30,
            roles: []
          },
          {
            workable: 0,
            worked: 0,
            balance: 0,
            recommended: 0,
            vacation: 0,
            roles: []
          },
          {
            workable: 150,
            worked: 10,
            balance: 100,
            recommended: 110,
            vacation: 0,
            roles: []
          }
        ]
      })

      const expectedResult: YearBalancePerMonth[] = [
        {
          balance: 100,
          recommended: 110,
          worked: 0,
          total: 30,
          vacations: {
            hours: 30,
            percentage: 100
          }
        },
        {
          balance: 0,
          recommended: 0,
          worked: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          total: 0
        },
        {
          balance: 100,
          recommended: 110,
          worked: 10,
          vacations: {
            hours: 0,
            percentage: 0
          },
          total: 10
        }
      ]

      const result = generateYearBalance['getAnnualBalancePerMonth'](timeSummary)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('getAnnualBalancePerRole', () => {
    it('should generate an empty balance role list when time summary object has not roles inside months details', async () => {
      const { generateYearBalance } = setup()
      const emptyTimeSummary = mockTimeSummary()
      const emptyRolesResponse = buildSearchRolesResponse({
        organizations: [],
        projects: [],
        projectRoles: []
      })

      const result = generateYearBalance['getAnnualBalancePerRole'](
        emptyTimeSummary,
        emptyRolesResponse
      )

      expect(result).toEqual([])
    })

    it('should generate the balance role list when', async () => {
      const { generateYearBalance } = setup()
      const organization = buildLiteProjectWithOrganizationId()
      const project = buildLiteProjectWithOrganizationId({ organizationId: organization.id })
      const projectRole = buildLiteProjectRoleWithProjectId({ projectId: project.id })
      const timeSummaryWithRoles = mockTimeSummary({
        months: [
          {
            workable: 150,
            worked: 10,
            balance: 100,
            recommended: 110,
            vacation: 0,
            roles: [
              {
                id: projectRole.id,
                hours: 10
              }
            ]
          },
          {
            workable: 0,
            worked: 0,
            balance: 0,
            recommended: 0,
            vacation: 0,
            roles: []
          },
          {
            workable: 150,
            worked: 100,
            balance: 10,
            recommended: 110,
            vacation: 0,
            roles: [
              {
                id: projectRole.id,
                hours: 75
              },
              {
                id: 0,
                hours: 25
              }
            ]
          }
        ]
      })
      const searchRolesResponseWithRole = buildSearchRolesResponse({
        organizations: [organization],
        projects: [project],
        projectRoles: [projectRole]
      })
      const expectedResult: YearBalanceRoles[] = [
        {
          organization: organization.name,
          project: project.name,
          role: projectRole.name,
          roleId: projectRole.id,
          worked: 85,
          months: [
            {
              percentage: 100,
              hours: 10
            },
            {
              percentage: 0,
              hours: 0
            },
            {
              percentage: 75,
              hours: 75
            }
          ]
        }
      ]

      const result = generateYearBalance['getAnnualBalancePerRole'](
        timeSummaryWithRoles,
        searchRolesResponseWithRole
      )

      expect(result).toEqual(expectedResult)
    })
  })

  describe('generate', () => {
    it('should return the year balance generated with months and roles data', () => {
      const { generateYearBalance } = setup()
      const months = [buildYearBalanceMonth()]
      const roles = [buildYearBalanceRole()]
      const timeSummary = mockTimeSummary()
      const searchRolesResponse = buildSearchRolesResponse()
      generateYearBalance['getAnnualBalancePerMonth'] = jest.fn().mockReturnValue(months)
      generateYearBalance['getAnnualBalancePerRole'] = jest.fn().mockReturnValue(roles)

      const result = generateYearBalance.generate(timeSummary, searchRolesResponse)

      expect(result).toEqual({ months, roles })
    })
  })
})

function setup() {
  return {
    generateYearBalance: new GenerateYearBalance()
  }
}

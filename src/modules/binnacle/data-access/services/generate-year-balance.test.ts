import {
  buildLiteProjectRoleWithProjectId,
  buildLiteProjectWithOrganizationId,
  buildSearchRolesResponse,
  buildYearBalanceMonth,
  buildYearBalanceRole,
  mockWorkingTime
} from 'test-utils/generateTestMocks'
import { YearBalanceRoles } from '../interfaces/year-balance.interface'
import { GenerateYearBalance } from './generate-year-balance'

describe('GenerateYearBalance', () => {
  describe('getAnnualBalancePerMonth', () => {
    it('should generate an empty monthly balance', async () => {
      const { generateYearBalance } = setup()
      const emptyWorkingTime = mockWorkingTime()
      const expectedResult = new Array(12).fill({
        balance: 0,
        recommended: 0,
        worked: 0
      })

      const result = generateYearBalance['getAnnualBalancePerMonth'](emptyWorkingTime)

      expect(result).toEqual(expectedResult)
    })

    it('should generate monthly balance when working time has months with data', async () => {
      const { generateYearBalance } = setup()
      const workingTime = mockWorkingTime({
        months: [
          {
            workable: 150,
            worked: 10,
            balance: 100,
            recommended: 110,
            roles: []
          },
          {
            workable: 0,
            worked: 0,
            balance: 0,
            recommended: 0,
            roles: []
          },
          {
            workable: 150,
            worked: 10,
            balance: 100,
            recommended: 110,
            roles: []
          }
        ]
      })

      const expectedResult = [
        {
          balance: 100,
          recommended: 110,
          worked: 10
        },
        {
          balance: 0,
          recommended: 0,
          worked: 0
        },
        {
          balance: 100,
          recommended: 110,
          worked: 10
        }
      ]

      const result = generateYearBalance['getAnnualBalancePerMonth'](workingTime)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('getAnnualBalancePerRole', () => {
    it('should generate an empty balance role list when working time object has not roles inside months details', async () => {
      const { generateYearBalance } = setup()
      const emptyWorkingTime = mockWorkingTime()
      const emptyRolesResponse = buildSearchRolesResponse({
        organizations: [],
        projects: [],
        projectRoles: []
      })

      const result = generateYearBalance['getAnnualBalancePerRole'](
        emptyWorkingTime,
        emptyRolesResponse
      )

      expect(result).toEqual([])
    })

    it('should generate the balance role list when', async () => {
      const { generateYearBalance } = setup()
      const organization = buildLiteProjectWithOrganizationId()
      const project = buildLiteProjectWithOrganizationId({ organizationId: organization.id })
      const projectRole = buildLiteProjectRoleWithProjectId({ projectId: project.id })
      const workingTimeWithRoles = mockWorkingTime({
        months: [
          {
            workable: 150,
            worked: 10,
            balance: 100,
            recommended: 110,
            roles: [
              {
                id: projectRole.id,
                worked: 10
              }
            ]
          },
          {
            workable: 0,
            worked: 0,
            balance: 0,
            recommended: 0,
            roles: []
          },
          {
            workable: 150,
            worked: 100,
            balance: 10,
            recommended: 110,
            roles: [
              {
                id: projectRole.id,
                worked: 75
              },
              {
                id: 0,
                worked: 25
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
              worked: 10
            },
            {
              percentage: 0,
              worked: 0
            },
            {
              percentage: 75,
              worked: 75
            }
          ]
        }
      ]

      const result = generateYearBalance['getAnnualBalancePerRole'](
        workingTimeWithRoles,
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
      const workingTime = mockWorkingTime()
      const searchRolesResponse = buildSearchRolesResponse()
      generateYearBalance['getAnnualBalancePerMonth'] = jest.fn().mockReturnValue(months)
      generateYearBalance['getAnnualBalancePerRole'] = jest.fn().mockReturnValue(roles)

      const result = generateYearBalance.generate(workingTime, searchRolesResponse)

      expect(result).toEqual({ months, roles })
    })
  })
})

function setup() {
  return {
    generateYearBalance: new GenerateYearBalance()
  }
}

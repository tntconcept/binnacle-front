import { LiteProjectMother } from '../../../../../../test-utils/mothers/lite-project-mother'
import { OrganizationMother } from '../../../../../../test-utils/mothers/organization-mother'
import { ProjectRoleMother } from '../../../../../../test-utils/mothers/project-role-mother'
import { SearchMother } from '../../../../../../test-utils/mothers/search-mother'
import { ActivityMother } from '../../../../../../test-utils/mothers/activity-mother'
import { YearBalancePerMonth, YearBalanceRoles } from '../year-balance'
import { GenerateYearBalance } from './generate-year-balance'

describe('GenerateYearBalance', () => {
  describe('getAnnualBalancePerMonth', () => {
    it('should generate an empty monthly balance', async () => {
      const { generateYearBalance } = setup()
      const emptyTimeSummary = ActivityMother.emptyTimeSummary()
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
      const timeSummary = ActivityMother.timeSummary()

      const expectedResult: YearBalancePerMonth[] = [
        {
          balance: -79.27,
          recommended: 141.77,
          total: 78.5,
          vacations: {
            hours: 16,
            percentage: 20.38216560509554
          },
          worked: 62.5
        },
        {
          balance: -141.77,
          recommended: 141.77,
          total: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 0
        },
        {
          balance: -141.77,
          recommended: 141.77,
          total: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 0
        },
        {
          balance: -127.58,
          recommended: 127.58,
          total: 40,
          vacations: {
            hours: 40,
            percentage: 100
          },
          worked: 0
        },
        {
          balance: -111.59,
          recommended: 141.77,
          total: 30.18,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 30.18
        },
        {
          balance: -155.93,
          recommended: 155.93,
          total: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 0
        },
        {
          balance: -148.85,
          recommended: 148.85,
          total: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 0
        },
        {
          balance: -155.93,
          recommended: 155.93,
          total: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 0
        },
        {
          balance: -148.85,
          recommended: 148.85,
          total: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 0
        },
        {
          balance: -148.85,
          recommended: 148.85,
          total: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 0
        },
        {
          balance: -141.77,
          recommended: 141.77,
          total: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 0
        },
        {
          balance: -127.58,
          recommended: 127.58,
          total: 0,
          vacations: {
            hours: 0,
            percentage: 0
          },
          worked: 0
        }
      ]

      const result = generateYearBalance['getAnnualBalancePerMonth'](timeSummary)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('getAnnualBalancePerRole', () => {
    it('should generate an empty balance role list when time summary object has not roles inside months details', async () => {
      const { generateYearBalance } = setup()
      const emptyTimeSummary = ActivityMother.emptyTimeSummary()
      const emptyRolesResponse = SearchMother.emptyRoles()

      const result = generateYearBalance['getAnnualBalancePerRole'](
        emptyTimeSummary,
        emptyRolesResponse
      )

      expect(result).toEqual([])
    })

    it('should generate the balance role list when', async () => {
      const { generateYearBalance } = setup()
      const organization = OrganizationMother.organization()
      const project = LiteProjectMother.billableLiteProjectWithOrganizationId()
      const projectRole = ProjectRoleMother.liteProjectRoleInMinutes()
      const timeSummaryWithRoles = ActivityMother.timeSummary()
      const searchRolesResponseWithRole = SearchMother.customRoles({
        organizations: [organization],
        projects: [project],
        projectRoles: [projectRole]
      })

      const expectedResult: YearBalanceRoles[] = [
        {
          months: [
            {
              hours: 25.07,
              percentage: 31.936305732484076
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            },
            {
              hours: 0,
              percentage: 0
            }
          ],
          organization: organization.name,
          project: project.name,
          role: projectRole.name,
          roleId: projectRole.id,
          worked: 25.07
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
      const months = [ActivityMother.yearBalanceMonth()]
      const roles = [ActivityMother.yearBalanceRole()]
      const timeSummary = ActivityMother.timeSummary()
      const searchRolesResponse = SearchMother.roles()
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

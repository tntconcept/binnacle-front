import {
  buildActivity,
  buildOrganization,
  buildProject,
  buildProjectRole,
  buildRecentRole
} from 'test-utils/generateTestMocks'
import { createActivityFormSchema, getInitialValues } from 'pages/binnacle/ActivityForm/utils'
import chrono from 'core/services/Chrono'
import { ActivityFormValues } from 'pages/binnacle/ActivityForm/ActivityFormLogic'

describe('ActivityForm utils', () => {
  describe('getInitialValues()', () => {
    it('given recent role, on create operation', function() {
      const activity = undefined
      const recentRole = buildRecentRole()
      const period = { startTime: '09:00', endTime: '10:00' }

      expect(getInitialValues(activity, recentRole, period)).toEqual({
        startTime: period.startTime,
        endTime: period.endTime,
        recentRole: recentRole,
        billable: recentRole.projectBillable,
        description: ''
      })
    })

    it('given recent role, on edit operation', function() {
      chrono.now = jest.fn(() => new Date('2020-10-10T20:00:00Z'))
      const activity = buildActivity({
        startDate: new Date('2020-10-10T10:00:00'),
        duration: 60
      })
      const recentRole = buildRecentRole({ id: 20 })
      const period = undefined

      expect(getInitialValues(activity, recentRole, period)).toEqual({
        startTime: '10:00',
        endTime: '11:00',
        description: activity.description,
        billable: activity.billable,
        recentRole: recentRole
      })
    })

    it('when recent role does NOT exist, on create operation', function() {
      const activity = undefined
      const recentRole = undefined
      const period = { startTime: '09:00', endTime: '10:00' }

      expect(getInitialValues(activity, recentRole, period)).toEqual({
        startTime: period!.startTime,
        endTime: period!.endTime,
        organization: undefined,
        project: undefined,
        role: undefined,
        billable: false,
        description: ''
      })
    })

    it('when recent role does NOT exist, on edit operation', function() {
      const organization = buildOrganization({ id: 10 })
      const project = buildProject({ id: 20 })
      const projectRole = buildProjectRole({ id: 30 })

      const activity = buildActivity({
        startDate: new Date('2020-10-10T09:00:00'),
        duration: 60,
        organization: organization,
        project: project,
        projectRole: projectRole
      })
      const recentRole = undefined
      const period = undefined

      expect(getInitialValues(activity, recentRole, period)).toEqual({
        startTime: '09:00',
        endTime: '10:00',
        description: activity.description,
        billable: activity.billable,
        organization: organization,
        project: project,
        role: projectRole
      })
    })
  })

  describe('createActivityFormSchema()', () => {
    const getErrors = async (schema: any, values: ActivityFormValues) => {
      const errors: any = {}

      for (const key in values) {
        try {
          await schema.validateAt(key, values)
          errors[key] = undefined
        } catch (e) {
          errors[key] = e.message
        }
      }

      return errors
    }

    const getYupError = (validationPromise: Promise<any>) => {
      return validationPromise.catch((e) => e.message)
    }

    it('should validate that fields are required when show recent roles is ENABLED', async () => {
      const schema = createActivityFormSchema(true)

      const values: ActivityFormValues = {
        startTime: '',
        endTime: '',
        billable: undefined!,
        description: '',
        recentRole: undefined
      }

      expect(await getErrors(schema, values)).toMatchInlineSnapshot(`
        Object {
          "billable": "form_errors.field_required",
          "description": "form_errors.field_required",
          "endTime": "form_errors.field_required",
          "recentRole": "form_errors.field_required",
          "startTime": "form_errors.field_required",
        }
      `)
    })

    it('should validate that fields are required when show recent roles is DISABLED', async () => {
      const schema = createActivityFormSchema(false)

      const values: ActivityFormValues = {
        startTime: '',
        endTime: '',
        billable: undefined!,
        description: '',
        organization: undefined,
        project: undefined,
        role: undefined
      }

      expect(await getErrors(schema, values)).toMatchInlineSnapshot(`
        Object {
          "billable": "form_errors.field_required",
          "description": "form_errors.field_required",
          "endTime": "form_errors.field_required",
          "organization": "form_errors.select_an_option",
          "project": "form_errors.select_an_option",
          "role": "form_errors.select_an_option",
          "startTime": "form_errors.field_required",
        }
      `)
    })

    it('should validate that end time is after start time', async () => {
      const schema = createActivityFormSchema(true)
      await expect(
        getYupError(
          schema.validateAt('endTime', {
            startTime: '14:00',
            endTime: '10:00'
          } as any)
        )
      ).resolves.toEqual('form_errors.end_time_greater')
    })

    it('should validate the description length', async () => {
      const schema = createActivityFormSchema(true)

      let bigDescription = ''
      for (let i = 0; i < 2050; i++) {
        bigDescription += 'x'
      }

      await expect(
        getYupError(
          schema.validateAt('description', {
            description: bigDescription
          } as any)
        )
      ).resolves.toEqual('form_errors.max_length 2050 / 2048')
    })
  })
})

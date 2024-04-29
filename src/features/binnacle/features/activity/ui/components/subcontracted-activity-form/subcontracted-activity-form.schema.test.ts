import { SubcontractedActivityFormValidationSchema } from './subcontracted-activity-form.schema'

import { validateYupSchema } from '../../../../../../../test-utils/validate-yup-schema'

describe('SubcontractedActivityFormValidationSchema', () => {
  it('activity entities are required', async () => {
    const values = {
      description: '',
      organization: undefined,
      project: undefined,
      projectRole: undefined,
      duration: NaN,
      month: undefined
    }
    expect(await validateYupSchema(SubcontractedActivityFormValidationSchema, values))
      .toMatchInlineSnapshot(`
      {
        "description": "form_errors.field_required",
        "duration": "form_errors.field_required",
        "month": "form_errors.field_required",
        "organization": "form_errors.select_an_option",
        "project": "form_errors.select_an_option",
        "projectRole": "form_errors.select_an_option",
      }
    `)
  })

  //   it('recent role is required when - show recent roles - is TRUE', async () => {
  //     const values = {
  //       showRecentRole: true,
  //       startTime: undefined,
  //       endTime: undefined,
  //       startDate: undefined,
  //       endDate: undefined,
  //       billable: undefined,
  //       description: '',
  //       organization: undefined,
  //       project: undefined,
  //       projectRole: undefined,
  //       recentProjectRole: undefined
  //     }

  //     expect(await validateYupSchema(SubcontractedActivityFormValidationSchema, values)).toMatchInlineSnapshot(`
  //       {
  //         "billable": "form_errors.field_required",
  //         "description": "form_errors.field_required",
  //         "endDate": "form_errors.field_required",
  //         "endTime": "form_errors.field_required",
  //         "recentProjectRole": "form_errors.select_an_option",
  //         "startDate": "form_errors.field_required",
  //         "startTime": "form_errors.field_required",
  //       }
  //     `)
  //   })

  //   it('should validate that end time is same or after start time', async () => {
  //     const isAfterValidation = getYupError(
  //         SubcontractedActivityFormValidationSchema.validateAt('endTime', {
  //         startTime: '09:00',
  //         endTime: '08:59'
  //       } as any)
  //     )

  //     const isSameValidation = getYupError(
  //         SubcontractedActivityFormValidationSchema.validateAt('endTime', {
  //         startTime: '09:00',
  //         endTime: '09:00'
  //       } as any)
  //     )

  //     await expect(isAfterValidation).resolves.toEqual('form_errors.end_time_greater')
  //     // is same time does not trigger an error
  //     await expect(isSameValidation).resolves.toEqual('09:00')
  //   })

  it('should validate that the duration is positive', async () => {
    const duration = -10
    await expect(
      getYupError(
        SubcontractedActivityFormValidationSchema.validateAt('duration', {
          duration: duration
        } as any)
      )
    ).resolves.toEqual('form_errors.negative_duration')
  })

  it('should validate that the duration is not more than the max permitted', async () => {
    const duration = 35791395
    await expect(
      getYupError(
        SubcontractedActivityFormValidationSchema.validateAt('duration', {
          duration: duration
        } as any)
      )
    ).resolves.toEqual('form_errors.max_duration_allowed')
  })

  it('should validate the description length', async () => {
    let bigDescription = ''
    for (let i = 0; i < 2050; i++) {
      bigDescription += 'x'
    }

    await expect(
      getYupError(
        SubcontractedActivityFormValidationSchema.validateAt('description', {
          description: bigDescription
        } as any)
      )
    ).resolves.toEqual('form_errors.max_length 2050 / 2048')
  })
})

const getYupError = (validationPromise: Promise<any>) => {
  return validationPromise.catch((e) => e.message)
}

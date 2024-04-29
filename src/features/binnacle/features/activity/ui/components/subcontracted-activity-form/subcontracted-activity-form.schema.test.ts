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

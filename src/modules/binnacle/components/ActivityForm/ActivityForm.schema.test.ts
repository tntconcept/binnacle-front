import { ActivityFormValidationSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'

describe('ActivityFormValidationSchema', () => {
  it('activity entities are required when - show recent roles - is FALSE', async () => {
    const values = {
      showRecentRole: false,
      startTime: undefined,
      endTime: undefined,
      billable: undefined,
      description: '',
      organization: undefined,
      project: undefined,
      role: undefined,
      recentRole: undefined,
      imageBase64: null
    }

    expect(await getYupErrors(ActivityFormValidationSchema, values)).toMatchInlineSnapshot(`
      Object {
        "billable": "form_errors.field_required",
        "description": "form_errors.field_required",
        "endTime": "form_errors.field_required",
        "imageBase64": undefined,
        "organization": "form_errors.select_an_option",
        "project": "form_errors.select_an_option",
        "recentRole": undefined,
        "role": "form_errors.select_an_option",
        "showRecentRole": undefined,
        "startTime": "form_errors.field_required",
      }
    `)
  })

  it('recent role is required when - show recent roles - is TRUE', async () => {
    const values = {
      showRecentRole: true,
      startTime: undefined,
      endTime: undefined,
      billable: undefined,
      description: '',
      organization: undefined,
      project: undefined,
      role: undefined,
      recentRole: undefined,
      imageBase64: null
    }

    expect(await getYupErrors(ActivityFormValidationSchema, values)).toMatchInlineSnapshot(`
      Object {
        "billable": "form_errors.field_required",
        "description": "form_errors.field_required",
        "endTime": "form_errors.field_required",
        "imageBase64": undefined,
        "organization": undefined,
        "project": undefined,
        "recentRole": "form_errors.field_required",
        "role": undefined,
        "showRecentRole": undefined,
        "startTime": "form_errors.field_required",
      }
    `)
  })

  it('should validate that end time is same or after start time', async () => {
    const isAfterValidation = getYupError(
      ActivityFormValidationSchema.validateAt('endTime', {
        startTime: '09:00',
        endTime: '10:20'
      } as any)
    )

    const isSameValidation = getYupError(
      ActivityFormValidationSchema.validateAt('endTime', {
        startTime: '09:00',
        endTime: '09:00'
      } as any)
    )

    await expect(isAfterValidation).resolves.toEqual('form_errors.end_time_greater')
    // is same time does not trigger an error
    await expect(isSameValidation).resolves.toEqual('09:00')
  })

  it('should validate the description length', async () => {
    let bigDescription = ''
    for (let i = 0; i < 2050; i++) {
      bigDescription += 'x'
    }

    await expect(
      getYupError(
        ActivityFormValidationSchema.validateAt('description', {
          description: bigDescription
        } as any)
      )
    ).resolves.toEqual('form_errors.max_length 2050 / 2048')
  })
})

const getYupErrors = async (schema: any, values: any) => {
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

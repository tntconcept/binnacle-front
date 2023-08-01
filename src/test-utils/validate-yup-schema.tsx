import * as yup from 'yup'

// Utility type to get the type of the values from the yup schema
type YupSchemaValues<T extends yup.AnyObjectSchema> = T extends yup.ObjectSchema<infer U>
  ? U
  : never

export async function validateYupSchema<T extends yup.AnyObjectSchema>(
  schema: T,
  values: Partial<YupSchemaValues<T>>
): Promise<Record<keyof YupSchemaValues<T>, string>> {
  const errors: Record<keyof YupSchemaValues<T>, string> = {} as Record<
    keyof YupSchemaValues<T>,
    string
  >

  for (const key in values) {
    try {
      await schema.validateAt(key as string, values)
    } catch (e) {
      errors[key as keyof YupSchemaValues<T>] = e.message
    }
  }

  return errors
}

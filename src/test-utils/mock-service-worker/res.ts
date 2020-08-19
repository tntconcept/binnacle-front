import { context, response, ResponseTransformer } from 'msw'

export function res(...transformers: ResponseTransformer[]) {
  if (process.env.NODE_ENV === 'test') {
    return response(...transformers)
  }

  // A custom response composition chain that embeds
  // a random realistic server response delay to each `res()` call.
  return response(...transformers, context.delay())
}

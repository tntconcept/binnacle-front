import { render as rtlRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FC, PropsWithChildren, ReactElement, ReactNode, Suspense } from 'react'
import { TntChakraProvider } from 'shared/providers/tnt-chakra-provider'
import { MemoryRouter } from 'react-router-dom'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <MemoryRouter>
      <TntChakraProvider>{children}</TntChakraProvider>
    </MemoryRouter>
  )
}

function render(ui: ReactElement) {
  return {
    ...rtlRender(<Suspense fallback={<p>Suspense fallback...</p>}>{ui}</Suspense>, {
      wrapper: Providers
    })
  }
}

async function getAllYupErrors(schema: any, values: any) {
  const errors: any = {}

  for (const key in values) {
    try {
      await schema.validateAt(key, values)
      errors[key] = undefined
    } catch (e) {
      errors[key] = e.message
    }
  }

  // Remove correct values
  Object.keys(errors).forEach((key) => errors[key] === undefined && delete errors[key])

  return errors
}

// @ts-ignore
export type ExtractComponentProps<T> = Parameters<T>[0]

export * from '@testing-library/react'
export { render, userEvent, getAllYupErrors }

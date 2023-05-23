import {
  render as rtlRender,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { AxiosError } from 'axios'
import React, { Suspense } from 'react'
import { statusCodeMap } from 'shared/components/Notifications/HttpStatusCodeMessage'
import { TntChakraProvider } from 'shared/providers/tnt-chakra-provider'

function render(ui: React.ReactElement) {
  return {
    ...rtlRender(<Suspense fallback={<p>Suspense fallback...</p>}>{ui}</Suspense>, {
      wrapper: ({ children }) => <TntChakraProvider>{children}</TntChakraProvider>
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

function createAxiosError(status: number, extra?: any): AxiosError {
  return {
    response: { status: status, ...extra },
    config: { params: {} },
    isAxiosError: true
  } as AxiosError
}

const waitForNotification = async (
  statusCodeOrDescription: number | { title: string; description: string }
) => {
  let title = ''
  if (typeof statusCodeOrDescription === 'number') {
    title = statusCodeMap[statusCodeOrDescription].title
  } else {
    title = statusCodeOrDescription.title
  }

  await waitFor(() => {
    const alerts = screen.queryAllByText(title)
    expect(alerts).not.toHaveLength(0)
  })
}

const waitForLoadingToFinish = () => {
  const loadingElements = [
    ...document.querySelectorAll('.chakra-spinner'),
    ...screen.queryAllByText(/loading/i)
  ]

  const hasElements = loadingElements.length > 0

  if (!hasElements) return Promise.resolve()

  return waitForElementToBeRemoved(() => loadingElements, { timeout: 4000 })
}

// @ts-ignore
export type ExtractComponentProps<T> = Parameters<T>[0]

export * from '@testing-library/react'
export {
  render,
  userEvent,
  getAllYupErrors,
  createAxiosError,
  waitForNotification,
  waitForLoadingToFinish
}

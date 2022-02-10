import {
  render as rtlRender,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AxiosError } from "axios";
import { MyChakraProvider } from "shared/providers/MyChakraProvider";
import { statusCodeMap } from "shared/components/Notifications/HttpStatusCodeMessage";
import React, { Suspense } from "react";

function render(ui: React.ReactElement) {
  return {
    ...rtlRender(<Suspense fallback={<p>Suspense fallback...</p>}>{ui}</Suspense>, {
      wrapper: ({ children }) => <MyChakraProvider>{children}</MyChakraProvider>
    })
  };
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

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [...document.querySelectorAll('.chakra-spinner'), ...screen.queryAllByText(/loading/i)],
    { timeout: 4000 }
  )

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

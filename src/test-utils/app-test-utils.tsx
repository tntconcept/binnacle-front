import React from 'react'
import userEvent from '@testing-library/user-event'
import { render as rtlRender } from '@testing-library/react'
import { AppProviders } from 'app/AppProviders'
import 'app/i18n'

function render(ui: React.ReactElement) {
  return {
    ...rtlRender(ui, {
      // @ts-ignore
      wrapper: AppProviders
    })
  }
}

export * from '@testing-library/react'
export { render, userEvent }

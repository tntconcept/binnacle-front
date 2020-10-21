import React from 'react'
import userEvent from '@testing-library/user-event'
import { render as rtlRender } from '@testing-library/react'
import { ChakraProviders } from 'app/ChakraProviders'
import 'app/i18n'

function render(ui: React.ReactElement) {
  return {
    ...rtlRender(ui, {
      // @ts-ignore
      wrapper: ChakraProviders
    })
  }
}

export * from '@testing-library/react'
export { render, userEvent }

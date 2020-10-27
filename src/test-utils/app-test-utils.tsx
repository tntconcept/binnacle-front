import React from 'react'
import userEvent from '@testing-library/user-event'
import { render as rtlRender } from '@testing-library/react'
import { MyChakraProvider } from 'core/providers/MyChakraProvider'
import 'core/i18n/i18n'

function render(ui: React.ReactElement) {
  return {
    ...rtlRender(ui, {
      // @ts-ignore
      wrapper: MyChakraProvider
    })
  }
}

export * from '@testing-library/react'
export { render, userEvent }

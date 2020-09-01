import React from 'react'
import { mount as cypressMount } from 'cypress-react-unit-test'
import { AppProviders } from 'app/AppProviders'
import 'app/i18n'

function render(ui: React.ReactElement) {
  return cypressMount(<AppProviders>{ui}</AppProviders>)
}

export * from 'cypress-react-unit-test'
export { render }

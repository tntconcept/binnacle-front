import './commands'
import { mount, MountOptions, MountReturn } from 'cypress/react18'
import '../../src/index.css'
import '../../src/test-utils/di/integration-di'
import '../../src/shared/archimedes/archimedes'
import { MemoryRouter } from 'react-router-dom'
import { MemoryRouterProps } from 'react-router-dom'
import { ReactNode } from 'react'
import { TntChakraProvider } from '../../src/shared/providers/tnt-chakra-provider'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        component: ReactNode,
        options?: MountOptions & { routerProps?: MemoryRouterProps }
      ): Cypress.Chainable<MountReturn>
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options

  const wrapped = (
    <MemoryRouter {...routerProps}>
      <TntChakraProvider>{component}</TntChakraProvider>
    </MemoryRouter>
  )

  return mount(wrapped, mountOptions)
})

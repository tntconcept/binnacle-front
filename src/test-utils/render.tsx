import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FC, PropsWithChildren, ReactElement } from 'react'
import { TntChakraProvider } from '../shared/providers/tnt-chakra-provider'

interface Options extends Omit<RenderOptions, 'wrapper'> {
  avoidChakraProvider?: boolean
}

const renderProviders: (customOptions?: Options) => FC<PropsWithChildren> =
  (customOptions) =>
  // eslint-disable-next-line react/display-name
  ({ children }) => {
    if (customOptions?.avoidChakraProvider) {
      return <>{children}</>
    }

    return <TntChakraProvider>{children}</TntChakraProvider>
  }

const customRender = (ui: ReactElement, options?: Options) =>
  render(ui, { wrapper: renderProviders(options), ...options })

export * from '@testing-library/react'
export { customRender as render, userEvent }

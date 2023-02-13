import type { FC } from 'react'
import { GlobalErrorBoundary } from 'shared/components/GlobalErrorBoundary'
import { MyChakraProvider } from 'shared/providers/MyChakraProvider'
import { BrowserRouter } from 'react-router-dom'

export const AppProviders: FC = (props) => {
  return (
    <BrowserRouter basename={'tnt'}>
      <MyChakraProvider>
        <GlobalErrorBoundary>{props.children}</GlobalErrorBoundary>
      </MyChakraProvider>
    </BrowserRouter>
  )
}

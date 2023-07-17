import { ChakraProvider } from '@chakra-ui/react'
import type { FC, PropsWithChildren } from 'react'
import { chakraTheme } from './chakra-theme'

// eslint-disable-next-line @typescript-eslint/ban-types
export const TntChakraProvider: FC<PropsWithChildren<{}>> = (props) => {
  return (
    <ChakraProvider theme={chakraTheme} resetCSS={true}>
      {props.children}
    </ChakraProvider>
  )
}

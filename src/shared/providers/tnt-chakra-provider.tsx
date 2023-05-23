import { ChakraProvider } from '@chakra-ui/react'
import type { FC } from 'react'
import { chakraTheme } from 'shared/providers/chakra-theme'

export const TntChakraProvider: FC = (props) => {
  return (
    <ChakraProvider theme={chakraTheme} resetCSS={true}>
      {props.children}
    </ChakraProvider>
  )
}

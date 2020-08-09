import React from 'react'
import { ChakraProvider, CSSReset, ColorModeOptions } from '@chakra-ui/core'
import theme from '@chakra-ui/theme'

const config: ColorModeOptions = {
  useSystemColorMode: false,
  initialColorMode: 'light'
}

const myTheme = {
  ...theme,
  config
}

export function AppProviders(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={myTheme}>
      <CSSReset />
      {props.children}
    </ChakraProvider>
  )
}

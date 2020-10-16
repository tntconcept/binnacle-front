import React, { useLayoutEffect } from 'react'
import {
  extendTheme,
  ChakraProvider,
  CSSReset,
  ColorModeOptions,
  useColorMode
} from '@chakra-ui/core'

const config: ColorModeOptions = {
  useSystemColorMode: false,
  initialColorMode: 'light'
}

const myTheme = extendTheme({ config })

const ThemeWorkaround = () => {
  const { setColorMode } = useColorMode()

  useLayoutEffect(() => {
    setColorMode('light')
  }, [setColorMode])

  return null
}

export function AppProviders(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={myTheme}>
      <CSSReset />
      <ThemeWorkaround />
      {props.children}
    </ChakraProvider>
  )
}

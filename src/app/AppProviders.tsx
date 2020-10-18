import React, { useLayoutEffect } from 'react'
import {
  extendTheme,
  ChakraProvider,
  CSSReset,
  ColorModeOptions,
  useColorMode,
  Box
} from '@chakra-ui/core'

const config: ColorModeOptions = {
  useSystemColorMode: false,
  initialColorMode: 'light'
}

const myTheme = extendTheme({
  colors: {
    brand: {
      50: '#e4e4ff',
      100: '#b2b3ff',
      200: '#8080ff',
      300: '#4e4dfe',
      400: '#1f1bfd',
      500: '#0a02e4',
      600: '#0301b2',
      700: '#000080',
      800: '#00004f',
      900: '#00001f'
    }
  },
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500'
      }
    }
  },
  config
})

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

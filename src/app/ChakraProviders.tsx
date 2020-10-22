import React, { useEffect } from 'react'
import {
  extendTheme,
  ChakraProvider,
  CSSReset,
  ColorModeOptions,
  useColorMode
} from '@chakra-ui/core'
import { mode } from '@chakra-ui/theme-tools'

const config: ColorModeOptions = {
  useSystemColorMode: false,
  initialColorMode: 'light'
}

const myTheme = extendTheme({
  colors: {
    brand: {
      50: '#D6D6FF',
      100: '#8585FF',
      200: '#5C5CFF',
      300: '#3333FF',
      400: '#0A0AFF',
      500: '#0000e8',
      600: '#0000b8',
      700: '#000090',
      750: '#00007A',
      800: '#00003d',
      900: '#000014'
    }
  },
  components: {
    Button: {
      variants: {
        solid: variantSolid
      }
    }
  },
  config
})

/* https://github.com/chakra-ui/chakra-ui/blob/master/packages/theme/src/components/button.ts */
function variantSolid(props: Record<string, any>) {
  const { colorScheme: c } = props
  if (c === 'gray')
    return {
      bg: mode(`gray.100`, `whiteAlpha.200`)(props),
      _hover: { bg: mode(`gray.200`, `whiteAlpha.300`)(props) },
      _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) }
    }

  if (c === 'brand') {
    return {
      bg: mode(`brand.500`, `brand.750`)(props),
      color: mode('white', `brand.50`)(props),
      _hover: { bg: mode(`brand.600`, `#000066`)(props) },
      _active: { bg: mode(`brand.700`, `#000052`)(props) }
    }
  }

  const { bg = `${c}.500`, color = 'white', hoverBg = `${c}.600`, activeBg = `${c}.700` } =
    accessibleColorMap[c] || {}
  return {
    bg: mode(bg, `${c}.200`)(props),
    color: mode(color, `gray.800`)(props),
    _hover: { bg: mode(hoverBg, `${c}.300`)(props) },
    _active: { bg: mode(activeBg, `${c}.400`)(props) }
  }
}

type AccessibleColor = {
  bg?: string
  color?: string
  hoverBg?: string
  activeBg?: string
}

/** Accessible color overrides for less accessible colors. */
const accessibleColorMap: { [key: string]: AccessibleColor } = {
  yellow: {
    bg: 'yellow.400',
    color: 'black',
    hoverBg: 'yellow.500',
    activeBg: 'yellow.600'
  },
  cyan: {
    bg: 'cyan.400',
    color: 'black',
    hoverBg: 'cyan.500',
    activeBg: 'cyan.600'
  }
}

function FixColorMode() {
  const { colorMode, setColorMode } = useColorMode()

  useEffect(() => {
    if (!colorMode) {
      setColorMode('light')
    }
  }, [colorMode, setColorMode])

  return null
}

export function ChakraProviders(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={myTheme}>
      <CSSReset />
      <FixColorMode />
      {props.children}
    </ChakraProvider>
  )
}

import React, { useEffect } from 'react'
import { extendTheme, ChakraProvider, ColorModeOptions, useColorMode } from '@chakra-ui/core'
import { mode } from '@chakra-ui/theme-tools'
import { useSettings } from 'pages/settings/Settings.utils'

const config: ColorModeOptions = {
  useSystemColorMode: false,
  initialColorMode: 'light'
}

const myTheme = extendTheme({
  fonts: {
    body: "'Work sans', system-ui, sans-serif",
    heading: "'Montserrat', sans-serif",
    mono: 'Menlo, monospace'
  },
  styles: {
    global: {
      '*, *::before, &::after': {
        position: 'relative'
      },
      '*:not(input)': {
        userSelect: 'none'
      }
    }
  },
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
      bg: mode(`brand.500`, `#00004d`)(props),
      color: mode('white', `white`)(props),
      _hover: { bg: mode(`brand.600`, `brand.800`)(props) },
      _active: { bg: mode(`brand.700`, `brand.800`)(props) }
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
  const darkModeEnabled = useSettings().darkMode

  useEffect(() => {
    if (!colorMode) {
      setColorMode(darkModeEnabled ? 'dark' : 'light')
    }
  }, [colorMode, setColorMode, darkModeEnabled])

  return null
}

export const MyChakraProvider: React.FC = (props) => {
  return (
    <ChakraProvider theme={myTheme} resetCSS={true}>
      <FixColorMode />
      {props.children}
    </ChakraProvider>
  )
}

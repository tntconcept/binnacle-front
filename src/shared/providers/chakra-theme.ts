import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { LocalStorageUserSettingsRepository } from '../../features/shared/user/features/settings/infrastructure/local-storage-user-settings-repository'
import { USER_SETTINGS_REPOSITORY } from '../di/container-tokens'
import { container } from 'tsyringe'

const localStorageUserSettingsRepository =
  container.resolve<LocalStorageUserSettingsRepository>(USER_SETTINGS_REPOSITORY)
const settings = localStorageUserSettingsRepository.get()

const Input = {
  variants: {
    outline: {
      field: {
        _invalid: {
          boxShadow: 'none'
        },
        _focus: {
          boxShadow: 'none'
        }
      }
    }
  }
}

export const chakraTheme = extendTheme({
  breakpoints: {
    sm: '767px'
  },
  fonts: {
    body: "'Work sans', system-ui, sans-serif",
    heading: "'Montserrat', sans-serif",
    mono: 'Menlo, monospace'
  },
  styles: {
    global: (props: any) => ({
      body: {
        bgColor: props.colorMode === 'light' ? 'white' : 'gray.800'
      }
    })
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
    },
    darkBrand: {
      50: '#e8e8ff',
      100: '#bcbdf9',
      200: '#9091ef',
      300: '#6465e7',
      400: '#3939df',
      500: '#2020c6',
      600: '#18199b',
      700: '#101170',
      800: '#070a45',
      900: '#03031d'
    }
  },
  components: {
    Button: {
      variants: {
        solid: variantSolid
      }
    },
    Input
  },
  config: {
    initialColorMode: settings.isSystemTheme ? 'system' : 'light'
  }
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
      // #2D5FDD
      bg: mode(`brand.500`, `darkBrand.400`)(props),
      color: mode('white', `whiteAlpha.900`)(props),
      _hover: { bg: mode(`brand.600`, `darkBrand.500`)(props) },
      _active: { bg: mode(`brand.700`, `darkBrand.600`)(props) }
    }
  }

  const {
    bg = `${c}.500`,
    color = 'white',
    hoverBg = `${c}.600`,
    activeBg = `${c}.700`
  } = accessibleColorMap[c] || {}
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

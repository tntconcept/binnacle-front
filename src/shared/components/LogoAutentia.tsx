import { Flex, useColorModeValue } from '@chakra-ui/react'
import { ReactComponent as Logo } from 'assets/logo.svg'
import type { FC } from 'react'

interface Props {
  size: 'sm' | 'lg'
}

export const LogoAutentia: FC<Props> = (props) => {
  const borderHoverColor = useColorModeValue('brand.600', 'white')

  const getLogo = () => {
    if (props.size === 'sm') {
      return (
        <Logo
          style={{
            height: '24px',
            marginTop: '5px'
          }}
        />
      )
    } else {
      return (
        <Logo
          style={{
            margin: '0 0 32px 0',
            display: 'block',
            width: '200px'
          }}
        />
      )
    }
  }

  return (
    <Flex
      _hover={{
        color: borderHoverColor
      }}
    >
      {getLogo()}
    </Flex>
  )
}

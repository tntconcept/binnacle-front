import { Flex, useColorModeValue } from '@chakra-ui/react'
import { ReactComponent as LogoImage } from 'assets/logo.svg'
import type { FC } from 'react'

interface Props {
  size: 'sm' | 'lg'
}

export const Logo: FC<Props> = (props) => {
  const borderHoverColor = useColorModeValue('brand.600', 'white')

  const getLogo = () => {
    if (props.size === 'sm') {
      return (
        <LogoImage
          style={{
            height: '24px',
            marginTop: '5px'
          }}
        />
      )
    } else {
      return (
        <LogoImage
          style={{
            margin: '0 0 32px 0',
            display: 'block',
            width: '150px'
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
      justifyContent="center"
    >
      {getLogo()}
    </Flex>
  )
}

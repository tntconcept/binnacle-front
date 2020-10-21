import React from 'react'
import { Flex } from '@chakra-ui/core'
import { ReactComponent as Logo } from 'assets/logo.svg'

interface Props {
  size: 'sm' | 'lg'
}

export const LogoAutentia: React.FC<Props> = (props) => {
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
        color: 'brand.600'
      }}
    >
      {getLogo()}
    </Flex>
  )
}

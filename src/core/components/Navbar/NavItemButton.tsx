import React from 'react'
import { Flex, useColorModeValue } from '@chakra-ui/core'

interface Props {
  keyboardKey: string
  icon: JSX.Element
  onClick: () => void
}

export const NavItemButton: React.FC<Props> = (props) => {
  const color = useColorModeValue('#424242', 'white')
  const hoverColor = useColorModeValue('brand.600', 'white')

  return (
    /* eslint-disable-next-line jsx-a11y/no-access-key */
    <Flex
      as="button"
      accessKey={props.keyboardKey}
      align="center"
      textTransform="uppercase"
      color={color}
      h="full"
      _hover={{
        color: hoverColor
      }}
      cursor="pointer"
      py={[2, 0]}
      px={[6, 0]}
      onClick={props.onClick}
    >
      {props.icon}
      {props.children}
    </Flex>
  )
}

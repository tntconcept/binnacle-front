import React from 'react'
import { Flex } from '@chakra-ui/core'

interface Props {
  keyboardKey: string
  icon: JSX.Element
  onClick: () => void
}

export const NavItemButton: React.FC<Props> = (props) => {
  return (
    /* eslint-disable-next-line jsx-a11y/no-access-key */
    <Flex
      as="button"
      accessKey={props.keyboardKey}
      align="center"
      textTransform="uppercase"
      color="#424242"
      h="full"
      _hover={{
        color: 'brand.600'
      }}
      cursor="pointer"
      px={[6, 0]}
      onClick={props.onClick}
    >
      {props.icon}
      {props.children}
    </Flex>
  )
}

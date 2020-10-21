import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { Flex } from '@chakra-ui/core'

interface Props {
  to: string
  keyboardKey: string
  icon: JSX.Element
}

export const NavItemLink: React.FC<Props> = (props) => {
  const isActive = useRouteMatch(props.to)

  return (
    /* eslint-disable-next-line jsx-a11y/no-access-key */
    <Flex
      as={Link}
      to={props.to}
      accessKey={props.keyboardKey}
      align="center"
      textTransform="uppercase"
      color="#424242"
      h="full"
      _hover={{
        color: 'brand.600'
      }}
      boxShadow={isActive ? ['inset -3px 0 0 0 #000080', 'inset 0 -2px 0 0 #000080'] : undefined}
      bgColor={isActive ? ['gray.100', 'unset'] : undefined}
      py={[1, 0]}
      px={[6, 0]}
    >
      {props.icon}
      {props.children}
    </Flex>
  )
}

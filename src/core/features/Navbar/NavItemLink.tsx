import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { Flex, useColorModeValue } from '@chakra-ui/core'

interface Props {
  to: string
  keyboardKey: string
  icon: JSX.Element
}

export const NavItemLink: React.FC<Props> = (props) => {
  const isActive = useRouteMatch(props.to)
  const color = useColorModeValue('#424242', 'white')
  const boxShadow = useColorModeValue(
    ['inset -3px 0 0 0 #000080', 'inset 0 -2px 0 0 #000080'],
    ['inset -3px 0 0 0 #e4e4ff', 'inset 0 -2px 0 0 #e4e4ff']
  )
  const hoverColor = useColorModeValue('brand.600', 'gray.400')
  const bgColor = useColorModeValue(['gray.100', 'unset'], ['gray.600', 'unset'])

  return (
    /* eslint-disable-next-line jsx-a11y/no-access-key */
    <Flex
      as={Link}
      to={props.to}
      accessKey={props.keyboardKey}
      align="center"
      textTransform="uppercase"
      color={color}
      h="full"
      _hover={{
        color: hoverColor
      }}
      boxShadow={isActive ? boxShadow : undefined}
      bgColor={isActive ? bgColor : undefined}
      py={[1, 0]}
      px={[6, 0]}
    >
      {props.icon}
      {props.children}
    </Flex>
  )
}

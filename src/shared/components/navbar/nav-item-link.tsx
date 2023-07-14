import { Box, Flex, FlexProps, useColorModeValue } from '@chakra-ui/react'
import type { FC, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../../hooks/use-is-mobile'

interface Props {
  to: string
  keyboardKey: string
  icon: ReactElement
  isActive: boolean
  isChild?: boolean
  py?: FlexProps['py']
  px?: FlexProps['px']
}

export const NavItemLink: FC<Props> = (props) => {
  const color = useColorModeValue('#424242', 'whiteAlpha.900')
  const hoverColor = useColorModeValue('brand.600', 'gray.400')
  const bgColor = useColorModeValue(['gray.100', 'unset'], ['gray.600', 'unset'])
  const isMobile = useIsMobile()

  const showUnderline = props.isActive && !isMobile
  const underlineBgColor = useColorModeValue('brand.600', 'gray.400')

  return (
    <Flex
      as={Link}
      to={props.to}
      accessKey={props.keyboardKey}
      align="center"
      textTransform="uppercase"
      color={props.isActive && props.isChild ? hoverColor : color}
      h="full"
      _hover={{
        color: hoverColor
      }}
      bgColor={props.isActive ? bgColor : undefined}
      py={props.py ?? [2, 0]}
      px={props.px ?? [6, 0]}
    >
      {showUnderline && !props.isChild && (
        <Box
          height="2px"
          width="100%"
          bgColor={underlineBgColor}
          position="absolute"
          bottom="0"
          borderRadius="10px"
        />
      )}
      {props.icon}
      {props.children}
    </Flex>
  )
}

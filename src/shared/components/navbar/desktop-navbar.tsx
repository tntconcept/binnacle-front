import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Logo } from '../logo'
import { NavMenu } from './nav-menu'

export function DesktopNavbar() {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')

  const isColumn = useMediaQuery({ query: '(max-width: 768px)' })
  const [direction, setDirection] = useState<'row' | 'column'>('row')

  useEffect(() => {
    setDirection(isColumn ? 'column' : 'row')
  }, [isColumn])

  return (
    <Box as="header" bgColor={bgColor}>
      <Flex
        as="nav"
        height="65px"
        direction={direction}
        justify="space-between"
        align="center"
        px="8"
        mb="4"
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Logo size="sm" />
        <NavMenu />
      </Flex>
    </Box>
  )
}

import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Logo } from '../logo'
import { NavMenu } from './nav-menu'
import { useIsMobile } from '../../hooks/use-is-mobile'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../router/paths'

export function DesktopNavbar() {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')

  const isColumn = useIsMobile()
  const [direction, setDirection] = useState<'row' | 'column'>('row')
  const navigate = useNavigate()

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
        <Logo onClick={() => navigate(paths.home)} size="sm" />
        <NavMenu />
      </Flex>
    </Box>
  )
}

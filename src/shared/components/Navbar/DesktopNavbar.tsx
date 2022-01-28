import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import { LogoAutentia } from 'shared/components/LogoAutentia'
import { NavMenu } from './NavMenu'

export function DesktopNavbar() {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Box as="header" bgColor={bgColor}>
      <Flex
        as="nav"
        height="65px"
        align="center"
        justify="space-between"
        px="8"
        mb="8"
        borderBottom="1px"
        borderColor={borderColor}
      >
        <LogoAutentia size="sm" />
        <NavMenu />
      </Flex>
    </Box>
  )
}

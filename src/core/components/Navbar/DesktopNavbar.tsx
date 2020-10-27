import React from 'react'
import { Box, Flex, useColorModeValue } from '@chakra-ui/core'
import { NavMenu } from './NavMenu'
import { LogoAutentia } from 'core/components/LogoAutentia'

export function DesktopNavbar() {
  const boxShadow = useColorModeValue('0 3px 10px 0 rgba(216, 222, 233, 0.15)', undefined)

  return (
    <Box as="header">
      <Flex
        // @ts-ignore
        as="nav"
        height="50px"
        align="center"
        justify="space-between"
        px="8"
        mb="8"
        boxShadow={boxShadow}
      >
        <LogoAutentia size="sm" />
        <NavMenu />
      </Flex>
    </Box>
  )
}

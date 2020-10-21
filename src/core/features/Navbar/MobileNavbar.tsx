import React from 'react'
import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  Icon
} from '@chakra-ui/core'
import { ReactComponent as MenuIcon } from 'heroicons/outline/menu-alt-3.svg'
import { NavMenu } from 'core/features/Navbar/NavMenu'
import { LogoAutentia } from 'core/components/LogoAutentia'

const MobileNavbar: React.FC = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef<any>(null!)

  const hasChildren = props.children !== undefined

  return (
    <Flex justify={hasChildren ? 'space-between' : 'flex-end'} align="center" height="50px" p={4}>
      {props.children}
      <Icon
        as={MenuIcon}
        boxSize={5}
        focusable={true}
        aria-label="Menu"
        onClick={onOpen}
        ref={btnRef}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>
              <LogoAutentia size="sm" />
            </DrawerHeader>
            <DrawerBody px={0}>
              <NavMenu />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  )
}

export default MobileNavbar

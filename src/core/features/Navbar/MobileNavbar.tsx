import React from 'react'
import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  Icon,
  Heading
} from '@chakra-ui/core'
import { ReactComponent as MenuIcon } from 'heroicons/outline/menu-alt-3.svg'
import { NavMenu } from 'core/features/Navbar/NavMenu'
import { LogoAutentia } from 'core/components/LogoAutentia'
import { useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const MobileNavbar: React.FC = (props) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef<any>(null!)
  const isSettingsPage = useRouteMatch('/settings')
  const isVacationsPage = useRouteMatch('/vacations')

  return (
    <Flex justify="space-between" align="center" height="50px" p={4}>
      {props.children}
      {isSettingsPage && <Heading>{t('pages.settings')}</Heading>}
      {isVacationsPage && <Heading>{t('pages.vacations')}</Heading>}
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

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { MenuAlt3Icon } from '@heroicons/react/outline'
import type { FC } from 'react'
import { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMatch } from 'react-router-dom'
import { LogoAutentia } from 'shared/components/LogoAutentia'
import { NavMenu } from 'shared/components/Navbar/NavMenu'
import { paths } from 'shared/router/paths'

const MenuIconWithRef = forwardRef((props, ref: any) => {
  return (
    <span ref={ref}>
      <MenuAlt3Icon {...props} />
    </span>
  )
})

MenuIconWithRef.displayName = 'MenuIconWithRef'

const MobileNavbar: FC = (props) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef<any>(null!)
  const isSettingsPage = useMatch(paths.settings)
  const isVacationsPage = useMatch(paths.vacations)

  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Flex justify="space-between" align="center" height="50px" p={4} bgColor={bgColor}>
      {props.children}
      {isSettingsPage && <Heading>{t('pages.settings')}</Heading>}
      {isVacationsPage && <Heading>{t('pages.vacations')}</Heading>}
      <Icon
        as={MenuIconWithRef}
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

MobileNavbar.displayName = 'MobileNavbar'

export default MobileNavbar

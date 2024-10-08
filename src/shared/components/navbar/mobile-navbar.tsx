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
import { Bars3BottomRightIcon } from '@heroicons/react/24/outline'
import type { FC, PropsWithChildren } from 'react'
import { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMatch } from 'react-router-dom'
import { Logo } from '../logo'
import { NavMenu } from './nav-menu'
import { paths } from '../../router/paths'

const MenuIconWithRef = forwardRef((props, ref: any) => {
  return (
    <span ref={ref}>
      <Bars3BottomRightIcon {...props} />
    </span>
  )
})

MenuIconWithRef.displayName = 'MenuIconWithRef'

export const MobileNavbar: FC<PropsWithChildren> = (props) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef<any>(null!)
  const isSettingsPage = useMatch(paths.settings)
  const isVacationsPage = useMatch(paths.vacations)
  const isPendingPage = useMatch(paths.pendingActivities)
  const isProjectsPage = useMatch(paths.projects)
  const isActivitiesPage = useMatch(paths.activities)

  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Flex justify="space-between" align="center" height="50px" p={4} bgColor={bgColor}>
      {props.children}
      {isSettingsPage && <Heading fontSize={20}>{t('pages.settings')}</Heading>}
      {isVacationsPage && <Heading fontSize={20}>{t('pages.vacations')}</Heading>}
      {isPendingPage && <Heading fontSize={20}>{t('pages.pending_activities')}</Heading>}
      {isProjectsPage && <Heading fontSize={20}>{t('pages.projects')}</Heading>}
      {isActivitiesPage && <Heading fontSize={20}>{t('pages.activities')}</Heading>}
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
              <Logo size="sm" />
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

import './ServiceWorkerPrompt.css'

import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useTranslation } from 'react-i18next'

export function ServiceWorkerPrompt() {
  const { t } = useTranslation()

  // replaced dynamically
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const buildDate = '__DATE__'
  // replaced dyanmicaly
  const reloadSW = '__RELOAD_SW__'

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // @ts-expect-error just ignore
      if (reloadSW === 'true') {
        r &&
          setInterval(() => {
            r.update()
          }, 20000)
      }
    }
  })

  const close = () => {
    setNeedRefresh(false)
  }

  return (
    <Modal
      isOpen={needRefresh}
      onClose={close}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <h2>{t('service_worker.new_version.title')}</h2>
          <span className="header__subtitle">{t('service_worker.new_version.subtitle')}</span>
        </ModalHeader>
        <ModalBody>
          <Flex direction="row" justifyContent="flex-end">
            <Button variant="solid" color="Highlight" onClick={() => updateServiceWorker(true)}>
              {t('service_worker.new_version.button')}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

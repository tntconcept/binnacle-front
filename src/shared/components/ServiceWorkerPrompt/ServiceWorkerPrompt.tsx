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
import { useEffect } from 'react'

export function ServiceWorkerPrompt() {
  const { t } = useTranslation()

  // replaced dynamically
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const buildDate = '__DATE__'
  // replaced dyanmicaly
  const reloadSW = '__RELOAD_SW__'
  const claim = '__CLAIMS__'

  // @ts-expect-error just ignore
  const isClaim = claim === 'true'

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

  useEffect(() => {
    const autorefresh = needRefresh && isClaim
    if (!autorefresh) return

    updateServiceWorker(true)
  }, [needRefresh])

  return (
    <Modal
      isOpen={needRefresh && !isClaim}
      onClose={close}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <h2 className="header__title">{t('service_worker.new_version.title')}</h2>
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

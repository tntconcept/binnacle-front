import './ServiceWorkerPrompt.css'

import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
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
            // eslint-disable-next-line no-console
            console.log('Checking for sw update')
            r.update()
          }, 20000 /* 20s for testing purposes */)
      }
    }
  })

  const close = () => {
    setNeedRefresh(false)
  }

  return (
    <Modal isOpen={needRefresh} onClose={close} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <h2>{t('service_worker.new_version.title')} 🎉</h2>
          <span className="header__subtitle">{t('service_worker.new_version.subtitle')}</span>
        </ModalHeader>
        <ModalBody>
          <Button variant="outline" onClick={() => updateServiceWorker(true)}>
            {t('service_worker.new_version.button')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

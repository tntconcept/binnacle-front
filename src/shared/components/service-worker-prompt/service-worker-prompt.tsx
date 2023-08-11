import styles from './service-worker-prompt.module.css'
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

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(_url, serviceWorker) {
      serviceWorker?.update()
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
          <h2 className={styles.header__title}>{t('service_worker.new_version.title')}</h2>
          <span className={styles.header__subtitle}>
            {t('service_worker.new_version.subtitle')}
          </span>
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

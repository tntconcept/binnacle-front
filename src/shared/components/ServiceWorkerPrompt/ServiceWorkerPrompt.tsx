import './ServiceWorkerPrompt.css'

import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function ServiceWorkerPrompt() {
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
          <h2>Hay una nueva version de Binnacle 🎉</h2>
          <span className="header__subtitle">Pulsa aceptar para recargar la página</span>
        </ModalHeader>
        <ModalBody>
          <Button variant="outline" onClick={() => updateServiceWorker(true)}>
            Aceptar
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/core'
// @ts-ignore
import React, { unstable_useTransition as useTransition } from 'react'
import { SUSPENSE_CONFIG } from 'utils/constants'

interface Props {
  onRemove: () => void
}

export const RemoveVacationButton: React.FC<Props> = (props) => {
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const [isOpen, setIsOpen] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef<HTMLElement>(null!)

  return (
    <>
      <Button
        colorScheme="red"
        variant="ghost"
        size="sm"
        px={0}
        onClick={() => setIsOpen(true)}
      >
        Eliminar
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold">
              Eliminar periodo de vacaciones
            </AlertDialogHeader>

            <AlertDialogBody>¿Estás seguro?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  startTransition(() => {
                    props.onRemove()
                  })
                }}
                ml={3}
                isLoading={isPending}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

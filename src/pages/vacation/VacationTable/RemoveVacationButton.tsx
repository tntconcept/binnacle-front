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
import React, { unstable_useTransition as useTransition, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SUSPENSE_CONFIG } from 'utils/constants'

interface Props {
  vacationId: number
  deleteVacationPeriod: (id: number) => Promise<void>
  onRefreshHolidays: () => void
}

export const RemoveVacationButton: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const [isOpen, setIsOpen] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef<HTMLElement>(null!)

  const [isDeleting, setIsDeleting] = useState(false)

  const handleRemove = async () => {
    setIsDeleting(true)
    await props.deleteVacationPeriod(props.vacationId)
    setIsDeleting(false)

    startTransition(() => {
      props.onRefreshHolidays()
    })
  }

  return (
    <>
      <Button
        colorScheme="red"
        variant="ghost"
        size="sm"
        px={0}
        onClick={() => setIsOpen(true)}
      >
        {t('actions.remove')}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('remove_vacation_modal.title')}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t('remove_vacation_modal.confirm_question')}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t('actions.cancel')}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleRemove}
                isLoading={isDeleting || isPending}
                ml={3}
              >
                {t('actions.remove')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

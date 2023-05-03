import { ExecutionOptions } from '@archimedes/arch'
import { Button } from '@chakra-ui/react'
import { DeleteVacationCmd } from 'features/binnacle/features/vacation/application/delete-vacation-cmd'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { Id } from 'shared/types/id'
import { RemoveVacationAlert } from './remove-vacation-alert'

interface Props {
  vacationId: Id
}

export const RemoveVacationButton: FC<Props> = (props) => {
  const { t } = useTranslation()
  const [showAlert, setShowAlert] = useState(false)
  const cancelButtonRef = useRef<HTMLButtonElement>(null!)
  const { isLoading, executeUseCase } = useGetUseCase(DeleteVacationCmd)

  const handleRemove = async () => {
    await executeUseCase(props.vacationId, {
      successMessage: t('vacation.remove_vacation_notification')
    } as ExecutionOptions)
    setShowAlert(false)
  }

  return (
    <>
      <Button colorScheme="red" variant="ghost" size="sm" onClick={() => setShowAlert(true)}>
        {t('actions.remove')}
      </Button>

      <RemoveVacationAlert
        open={showAlert}
        leastDestructiveRef={cancelButtonRef}
        onClose={() => setShowAlert(false)}
        onClick={handleRemove}
        deleting={isLoading}
      />
    </>
  )
}

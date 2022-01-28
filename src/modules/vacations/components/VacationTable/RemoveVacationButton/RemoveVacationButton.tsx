import { Button } from '@chakra-ui/react'
import { RemoveVacationAlert } from 'modules/vacations/components/VacationTable/RemoveVacationButton/RemoveVacationAlert'
import { DeleteVacationPeriodAction } from 'modules/vacations/data-access/actions/delete-vacation-period-action'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'

interface Props {
  vacationId: number
}

export const RemoveVacationButton: FC<Props> = (props) => {
  const { t } = useTranslation()
  const [showAlert, setShowAlert] = useState(false)
  const cancelButtonRef = useRef<HTMLButtonElement>(null!)

  const [deleteVacationPeriod, pending] = useActionLoadable(DeleteVacationPeriodAction)

  const handleRemove = async () => {
    await deleteVacationPeriod(props.vacationId)
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
        deleting={pending}
      />
    </>
  )
}

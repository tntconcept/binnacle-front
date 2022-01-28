import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { VacationForm } from 'modules/vacations/components/VacationForm/VacationForm'
import { getVacationErrorMessage } from 'modules/vacations/components/VacationFormModal/get-vacation-error-message'
import { CreateVacationPeriodAction } from 'modules/vacations/data-access/actions/create-vacation-period-action'
import { UpdateVacationPeriodAction } from 'modules/vacations/data-access/actions/update-vacation-period-action'
import type { VacationFormValues } from 'modules/vacations/data-access/interfaces/vacation-form-values.interface'
import { useTranslation } from 'react-i18next'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'
import SubmitButton from 'shared/components/FormFields/SubmitButton'

interface Props {
  isOpen: boolean
  initialValues: VacationFormValues
  onClose: () => void
}

export const VacationFormModal = (props: Props) => {
  const { t } = useTranslation()
  const [createVacationPeriod, pendingCreate] = useActionLoadable(CreateVacationPeriodAction, {
    showAlertError: getVacationErrorMessage
  })
  const [updateVacationPeriod, pendingUpdate] = useActionLoadable(UpdateVacationPeriodAction, {
    showAlertError: getVacationErrorMessage
  })

  const handleCreateVacationPeriod = async (values: VacationFormValues) => {
    try {
      await createVacationPeriod(values)
      props.onClose()
    } catch (e) {

    }
  }

  const handleUpdateVacationPeriod = async (values: Required<VacationFormValues>) => {
    try {
      await updateVacationPeriod(values)
      props.onClose()
    } catch (e) {
    }
  }

  return (
    <Modal onClose={props.onClose} size="xl" isOpen={props.isOpen} closeOnEsc={true}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>{t('vacation_form.form_header')}</ModalHeader>
          <ModalCloseButton aria-label={t('actions.close')} />
          <ModalBody>
            {props.isOpen && (
              <VacationForm
                values={props.initialValues}
                createVacationPeriod={handleCreateVacationPeriod}
                updateVacationPeriod={handleUpdateVacationPeriod}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <SubmitButton
              formId="vacation-form"
              isLoading={pendingCreate || pendingUpdate}
            >
              {t('actions.save')}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

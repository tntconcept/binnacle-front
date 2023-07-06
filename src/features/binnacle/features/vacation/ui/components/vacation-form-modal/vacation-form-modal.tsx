import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { SubmitButton } from 'shared/components/form-fields/submit-button'
import { useResolve } from 'shared/di/use-resolve'
import { useIsMobile } from 'shared/hooks'
import { CreateVacationCmd } from '../../../application/create-vacation-cmd'
import { UpdateVacationCmd } from '../../../application/update-vacation-cmd'
import { NewVacation } from '../../../domain/new-vacation'
import { VacationErrorMessage } from '../../../domain/services/vacation-error-message'
import { UpdateVacation } from '../../../domain/update-vacation'
import { VacationForm } from '../vacation-form/vacation-form'
import { useState } from 'react'

interface Props {
  isOpen: boolean
  initialValues: NewVacation | UpdateVacation
  onClose: () => void
}

export const VacationFormModal = (props: Props) => {
  const { t } = useTranslation()
  const vacationErrorMessage = useResolve(VacationErrorMessage)
  const isMobile = useIsMobile()
  const { useCase: createVacationCmd } = useGetUseCase(CreateVacationCmd)
  const { useCase: updateVacationCmd } = useGetUseCase(UpdateVacationCmd)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCreateVacationPeriod = async (values: NewVacation) => {
    try {
      await createVacationCmd.execute(values, {
        showToastError: true,
        errorMessage: vacationErrorMessage.get
      })
      setIsLoading(false)
      props.onClose()
    } catch (e) {
      setIsLoading(false)
    }
  }

  const handleUpdateVacationPeriod = async (values: UpdateVacation) => {
    try {
      await updateVacationCmd.execute(values, {
        showToastError: true,
        errorMessage: vacationErrorMessage.get
      })
      setIsLoading(false)
      props.onClose()
    } catch (e) {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      onClose={props.onClose}
      size={isMobile ? 'full' : 'xl'}
      isOpen={props.isOpen}
      closeOnEsc={true}
    >
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
                onSubmit={() => setIsLoading(true)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <SubmitButton formId="vacation-form" isLoading={isLoading}>
              {t('actions.save')}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

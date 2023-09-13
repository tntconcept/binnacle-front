import { ExecutionOptions } from '@archimedes/arch'
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
import { useGetUseCase } from '../../../../../../../shared/arch/hooks/use-get-use-case'
import { SubmitButton } from '../../../../../../../shared/components/form-fields/submit-button'
import { useResolve } from '../../../../../../../shared/di/use-resolve'
import { CreateVacationCmd } from '../../../application/create-vacation-cmd'
import { UpdateVacationCmd } from '../../../application/update-vacation-cmd'
import { NewVacation } from '../../../domain/new-vacation'
import { VacationErrorMessage } from '../../../domain/services/vacation-error-message'
import { UpdateVacation } from '../../../domain/update-vacation'
import { VacationForm } from '../vacation-form/vacation-form'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'

interface Props {
  isOpen: boolean
  initialValues: NewVacation | UpdateVacation
  chargeYear: number
  onClose: () => void
}

export const VacationFormModal = (props: Props) => {
  const { t } = useTranslation()
  const vacationErrorMessage = useResolve(VacationErrorMessage)
  const isMobile = useIsMobile()
  const { executeUseCase: createVacationCmd, isLoading: isLoadingCreateVacation } =
    useGetUseCase(CreateVacationCmd)
  const { executeUseCase: updateVacationCmd, isLoading: isLoadingUpdateVacation } =
    useGetUseCase(UpdateVacationCmd)

  const handleCreateVacationPeriod = async (values: NewVacation) => {
    createVacationCmd({ newVacation: values, chargeYear: props.chargeYear }, {
      showToastError: true,
      errorMessage: vacationErrorMessage.get
    } as ExecutionOptions)
      .then(() => props.onClose())
      .catch(() => {})
  }

  const handleUpdateVacationPeriod = async (values: UpdateVacation) => {
    updateVacationCmd(values, {
      showToastError: true,
      errorMessage: vacationErrorMessage.get
    } as ExecutionOptions)
      .then(() => props.onClose())
      .catch(() => {})
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
              />
            )}
          </ModalBody>
          <ModalFooter>
            <SubmitButton
              formId="vacation-form"
              isLoading={isLoadingCreateVacation || isLoadingUpdateVacation}
            >
              {t('actions.save')}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

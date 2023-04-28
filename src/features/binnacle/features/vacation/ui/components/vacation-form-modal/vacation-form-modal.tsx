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
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import { useIsMobile } from 'shared/hooks'
import { CreateVacationCmd } from '../../../application/create-vacation-cmd'
import { UpdateVacationCmd } from '../../../application/update-vacation-cmd'
import { NewVacation } from '../../../domain/new-vacation'
import { UpdateVacation } from '../../../domain/update-vacation'
import { VacationForm } from '../vacation-form/vacation-form'

interface Props {
  isOpen: boolean
  initialValues: NewVacation | UpdateVacation
  onClose: () => void
}

export const VacationFormModal = (props: Props) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { isLoading: isLoadingCreate, executeUseCase: createVacationCmd } =
    useGetUseCase(CreateVacationCmd)
  const { isLoading: isLoadingUpdate, executeUseCase: updateVacationCmd } =
    useGetUseCase(UpdateVacationCmd)

  const handleCreateVacationPeriod = async (values: NewVacation) => {
    try {
      await createVacationCmd(values)
      props.onClose()
    } catch (e) {}
  }

  const handleUpdateVacationPeriod = async (values: UpdateVacation) => {
    try {
      await updateVacationCmd(values)
      props.onClose()
    } catch (e) {}
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
            <SubmitButton formId="vacation-form" isLoading={isLoadingCreate || isLoadingUpdate}>
              {t('actions.save')}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

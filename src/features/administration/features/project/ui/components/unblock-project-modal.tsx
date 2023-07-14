import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { t } from 'i18next'
import { FC } from 'react'
import { useGetUseCase } from '../../../../../../shared/arch/hooks/use-get-use-case'
import { useResolve } from '../../../../../../shared/di/use-resolve'
import { useIsMobile } from '../../../../../../shared/hooks/use-is-mobile'
import { UnblockProjectCmd } from '../../application/unblock-project-cmd'
import { Project } from '../../domain/project'
import { ProjectErrorMessage } from '../../domain/services/project-error-message'

interface Props {
  project: Project
  onCancel(): void
  onClose(): void
}
export const UnblockProjectModal: FC<Props> = (props) => {
  const { project, onClose, onCancel } = props
  const isMobile = useIsMobile()
  const projectErrorMessage = useResolve(ProjectErrorMessage)

  const { useCase: unblockProjectCmd } = useGetUseCase(UnblockProjectCmd)

  const unblockProject = async () => {
    await unblockProjectCmd.execute(project.id, {
      successMessage: t('project_modal.unblock_project_notification'),
      showToastError: true,
      errorMessage: projectErrorMessage.get
    })
    onClose()
  }

  return (
    <Modal
      onClose={onCancel}
      isOpen={true}
      scrollBehavior="inside"
      isCentered={true}
      size={isMobile ? 'full' : 'xl'}
    >
      <ModalOverlay data-no-focus-lock="true">
        <ModalContent>
          <Box>
            <ModalHeader>
              {t('project_modal.unblock_title')} {project.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box fontSize={14}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: t('project_modal.unblock_description')
                  }}
                ></p>
              </Box>
            </ModalBody>
            <ModalFooter justifyContent={'space-between'}>
              <>
                <Button key={'cancel'} colorScheme="grey" variant="ghost" onClick={onCancel}>
                  {t('actions.cancel')}
                </Button>
                <Button
                  key={'unblock'}
                  colorScheme="brand"
                  variant="solid"
                  onClick={unblockProject}
                >
                  {t('project_modal.accept')}
                </Button>
              </>
            </ModalFooter>
          </Box>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

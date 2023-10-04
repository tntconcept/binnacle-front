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
import { yupResolver } from '@hookform/resolvers/yup'
import { FC, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../shared/arch/hooks/use-get-use-case'
import { SubmitButton } from '../../../../../../shared/components/form-fields/submit-button'
import { useResolve } from '../../../../../../shared/di/use-resolve'
import { DateField } from '../../../../../../shared/components/form-fields/date-field'
import { chrono, parseISO } from '../../../../../../shared/utils/chrono'
import { BlockProjectCmd } from '../../application/block-project-cmd'
import { ProjectModalFormSchema, ProjectModalFormValidationSchema } from './project-modal.schema'
import { useIsMobile } from '../../../../../../shared/hooks/use-is-mobile'
import { Project } from '../../../../../shared/project/domain/project'
import { ProjectErrorMessage } from '../../../../../shared/project/domain/services/project-error-message'

type ProjectModalProps = {
  onClose(): void
  onCancel(): void
  onUnblockPressed(): void
  project: Project
}

export const BlockProjectModal: FC<ProjectModalProps> = (props) => {
  const { project, onClose, onCancel, onUnblockPressed } = props
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const projectErrorMessage = useResolve(ProjectErrorMessage)
  const { useCase: blockProjectCmd } = useGetUseCase(BlockProjectCmd)

  const maxDate = chrono(chrono.now().toISOString()).format('yyyy-MM-dd')

  const hasBlockDate = useMemo(() => {
    return project.blockDate
  }, [project])

  const defaultFormValues = useMemo(() => {
    if (hasBlockDate) {
      return { blockDate: chrono(project.blockDate!.toISOString()).format('yyyy-MM-dd') }
    }

    return { blockDate: maxDate }
  }, [hasBlockDate, maxDate, project.blockDate])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProjectModalFormSchema>({
    defaultValues: defaultFormValues,
    resolver: yupResolver(ProjectModalFormValidationSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: ProjectModalFormSchema) => {
    await blockProjectCmd.execute(
      {
        projectId: project.id,
        date: parseISO(data.blockDate)
      },
      {
        successMessage: t('project_modal.block_project_notification'),
        showToastError: true,
        errorMessage: projectErrorMessage.get
      }
    )

    onClose()
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={true}
      scrollBehavior="inside"
      isCentered={true}
      size={isMobile ? 'full' : 'xl'}
    >
      <ModalOverlay data-no-focus-lock="true">
        <ModalContent>
          <Box as={'form'} onSubmit={handleSubmit(onSubmit)} id={'project-modal-form'}>
            <ModalHeader>
              {hasBlockDate ? t('project_modal.edit_block_title') : t('project_modal.block_title')}{' '}
              {project.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box fontSize={14}>
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      project.open && hasBlockDate
                        ? t('project_modal.edit_block_description', {
                            userName: project.blockedByUserName,
                            blockDate: chrono(project.blockDate!.toISOString()).format('dd/MM/yyyy')
                          })
                        : t('project_modal.block_description')
                  }}
                ></p>
              </Box>
              <Box width={'172px'} marginTop={22}>
                <DateField
                  label={t('project_modal.blocking_date')}
                  max={maxDate}
                  error={errors.blockDate?.message}
                  {...register('blockDate')}
                />
              </Box>
            </ModalBody>
            <ModalFooter justifyContent={'space-between'}>
              {
                <>
                  <Button key={'cancel'} colorScheme="grey" variant="ghost" onClick={onCancel}>
                    {t('actions.cancel')}
                  </Button>
                  <Box>
                    {hasBlockDate && (
                      <Button
                        key={'unblock'}
                        colorScheme="brand"
                        variant="ghost"
                        onClick={onUnblockPressed}
                        marginRight={3}
                      >
                        {t('project_modal.unblock_title')}
                      </Button>
                    )}
                    <SubmitButton formId="project-modal-form">
                      {t('project_modal.block')}
                    </SubmitButton>
                  </Box>
                </>
              }
            </ModalFooter>
          </Box>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

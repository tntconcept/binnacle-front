import { FC, useEffect } from 'react'
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../../../../../../shared/hooks'
import DateField from '../../../../../../shared/components/FormFields/DateField'
import chrono from '../../../../../../shared/utils/chrono'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { ProjectModalFormSchema, ProjectModalFormValidationSchema } from './project-modal.schema'
import { Project } from '../../domain/project'

type ProjectModalProps = {
  isOpen: boolean
  onClose(): void
  title: string
  description: string
  showDateField: boolean
  onSubmit: SubmitHandler<ProjectModalFormSchema>
  selectedProject?: Project
  actions?: React.ReactNode
}
export const ProjectModal: FC<ProjectModalProps> = (props) => {
  const {
    onClose,
    isOpen = false,
    title,
    description,
    selectedProject,
    showDateField,
    actions,
    onSubmit
  } = props
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const maxDate = chrono(chrono.now().toISOString()).format('yyyy-MM-dd')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProjectModalFormSchema>({
    defaultValues: {
      blockDate: maxDate
    },
    resolver: yupResolver(ProjectModalFormValidationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    selectedProject?.blockDate
      ? setValue('blockDate', chrono(selectedProject.blockDate.toISOString()).format('yyyy-MM-dd'))
      : setValue('blockDate', maxDate)
  }, [selectedProject])

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior="inside"
      isCentered={true}
      size={isMobile ? 'full' : 'xl'}
    >
      <ModalOverlay
        // Prevent focus fighting because of CellBody component
        // https://github.com/theKashey/focus-lock/#focus-fighting
        data-no-focus-lock="true"
      >
        <ModalContent>
          <Box as={'form'} onSubmit={handleSubmit(onSubmit)} id={'project-modal-form'}>
            <ModalHeader>
              {t(title)} {selectedProject?.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box fontSize={14}>
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedProject?.open && selectedProject.blockDate
                        ? t(description, {
                            userName: selectedProject.blockedByUserName,
                            blockDate: chrono(selectedProject.blockDate.toISOString()).format(
                              'dd/MM/yyyy'
                            )
                          })
                        : t(description)
                  }}
                ></p>
              </Box>
              {showDateField && (
                <Box width={'172px'} marginTop={22}>
                  <DateField
                    label={t('vacation_form.start_date')}
                    max={maxDate}
                    error={errors.blockDate?.message}
                    {...register('blockDate')}
                  />
                </Box>
              )}
            </ModalBody>
            <ModalFooter justifyContent={'space-between'}>{actions}</ModalFooter>
          </Box>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

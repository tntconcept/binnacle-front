import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { useTranslation } from 'react-i18next'
import { ProjectsFilterFormCombos } from './components/combos/projects-combos'
import Table from '../../../../../shared/components/table/table'
import { useEffect, useState } from 'react'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'
import { Box, Button } from '@chakra-ui/react'
import { useIsMobile } from '../../../../../shared/hooks'
import { GetProjectsListQry } from '../application/get-projects-list-qry'
import { AdaptedProjects, adaptProjectsToTable } from './projects-page-utils'
import { Project } from '../domain/project'
import { StatusBadge } from './components/status-badge'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { SubmitHandler } from 'react-hook-form'
import { ProjectsFilterFormSchema } from './components/combos/projects-filter-form.schema'
import { ProjectModal } from './components/project-modal'
import { ProjectModalFormSchema } from './components/project-modal.schema'
import SubmitButton from '../../../../../shared/components/FormFields/SubmitButton'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { BlockProjectCmd } from '../application/block-project-cmd'
import { parseISO } from '../../../../../shared/utils/chrono'
import { useResolve } from '../../../../../shared/di/use-resolve'
import { ProjectErrorMessage } from '../domain/services/project-error-message'

const ProjectsPage = () => {
  const { t } = useTranslation()
  const [tableProjects, setTableProjects] = useState<AdaptedProjects[]>([])
  const [organizationName, setOrganizationName] = useState<string>('')
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false)
  const [showEditBlockModal, setShowEditBlockModal] = useState<boolean>(false)
  const [selectedProject, setSelectedProject] = useState<Project>()
  const isMobile = useIsMobile()

  const projectErrorMessage = useResolve(ProjectErrorMessage)
  const { useCase: blockProjectCmd } = useGetUseCase(BlockProjectCmd)

  const {
    isLoading: isLoadingProjectsList,
    result: projectList = [],
    executeUseCase: getProjectsListQry
  } = useExecuteUseCaseOnMount(GetProjectsListQry)

  const applyFilters: SubmitHandler<ProjectsFilterFormSchema> = async (data): Promise<void> => {
    if (data.organization?.id) {
      setOrganizationName(data.organization.name)
      const organizationWithStatus = {
        organizationId: data.organization.id,
        open: data.status?.value || true
      }
      await getProjectsListQry(organizationWithStatus)
    }
  }

  useEffect(() => {
    if (!isLoadingProjectsList) {
      setTableProjects(adaptProjectsToTable(organizationName, projectList))
    }
  }, [isLoadingProjectsList, projectList])

  const onCloseBlockModal = () => {
    setShowBlockModal(false)
  }

  const onCloseEditBlockModal = () => {
    setShowEditBlockModal(false)
  }

  const blockProject: SubmitHandler<ProjectModalFormSchema> = async (data) => {
    if (selectedProject?.id && data.blockDate) {
      await blockProjectCmd.execute(
        {
          projectId: selectedProject?.id,
          date: parseISO(data.blockDate)
        },
        {
          successMessage: t('project_modal.block_project_notification'),
          showToastError: true,
          errorMessage: projectErrorMessage.get
        }
      )
    }
  }

  const columns: ColumnsProps[] = [
    {
      title: 'projects.organization',
      dataIndex: 'organization',
      key: 'organization'
    },
    {
      title: 'projects.project',
      dataIndex: 'project',
      key: 'project',
      showInMobile: true
    },
    {
      title: 'projects.start_date',
      dataIndex: 'startDate',
      key: 'startDate'
    },
    {
      title: 'projects.status',
      dataIndex: 'open',
      key: 'open',
      render: (open: boolean) => <StatusBadge status={open} />
    },
    {
      title: 'projects.billable',
      dataIndex: 'billable',
      key: 'billable',
      render: (billable: boolean) => (billable ? t('projects.yes') : t('projects.no'))
    },
    {
      title: 'projects.blocking_date',
      dataIndex: 'blockDate',
      key: 'blockDate',
      showInMobile: true
    },

    {
      title: 'projects.actions',
      dataIndex: 'action',
      key: 'action',
      render: (project: Project) => {
        if (project.open && project.blockDate) {
          return (
            <Button
              key={'action' + project.id}
              colorScheme="blue"
              variant="ghost"
              size="sm"
              marginLeft={isMobile ? 'auto' : ''}
              display={isMobile ? 'block' : ''}
              onClick={() => {
                setSelectedProject(project)
                setShowEditBlockModal(true)
              }}
            >
              {t('actions.edit_block')}
            </Button>
          )
        }
        if (project.open && !project.blockDate) {
          return (
            <Button
              key={'action' + project.id}
              colorScheme="blue"
              variant="ghost"
              size="sm"
              marginLeft={isMobile ? 'auto' : ''}
              display={isMobile ? 'block' : ''}
              onClick={() => {
                setSelectedProject(project)
                setShowBlockModal(true)
              }}
            >
              {t('actions.block')}
            </Button>
          )
        }
        return
      }
    }
  ]

  return (
    <PageWithTitle title={t('pages.projects')}>
      <ProjectsFilterFormCombos onFiltersChange={applyFilters} />
      <Table
        columns={columns}
        dataSource={tableProjects}
        emptyTableKey={'projects.filter_required'}
      ></Table>
      <ProjectModal
        isOpen={showBlockModal}
        onClose={onCloseBlockModal}
        title={'project_modal.block_title'}
        description={'project_modal.block_description'}
        showDateField={true}
        selectedProject={selectedProject}
        onSubmit={blockProject}
        actions={
          <>
            <Button
              key={'cancel'}
              colorScheme="grey"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowBlockModal(false)
              }}
            >
              {t('actions.cancel')}
            </Button>
            <SubmitButton formId="project-modal-form">{t('actions.block')}</SubmitButton>
          </>
        }
      />
      <ProjectModal
        isOpen={showEditBlockModal}
        onClose={onCloseEditBlockModal}
        title={'project_modal.edit_block_title'}
        description={'project_modal.edit_block_description'}
        showDateField={true}
        selectedProject={selectedProject}
        onSubmit={blockProject}
        actions={
          <>
            <Button
              key={'cancel'}
              colorScheme="grey"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowBlockModal(false)
              }}
            >
              {t('actions.cancel')}
            </Button>
            <Box>
              <SubmitButton formId="project-modal-form">{t('actions.block')}</SubmitButton>
            </Box>
          </>
        }
      />
    </PageWithTitle>
  )
}

export default ProjectsPage

import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from '../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import Table from '../../../../../shared/components/table/table'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'
import { useIsMobile } from '../../../../../shared/hooks'
import { Organization } from '../../../../binnacle/features/organization/domain/organization'
import { BlockProjectCmd } from '../application/block-project-cmd'
import { GetProjectsListQry } from '../application/get-projects-list-qry'
import { UnblockProjectCmd } from '../application/unblock-project-cmd'
import { OrganizationWithStatus } from '../domain/organization-status'
import { Project } from '../domain/project'
import { ProjectStatus } from '../domain/project-status'
import { BlockProjectModal } from './components/block-project-modal'
import { ProjectsFilterFormCombos } from './components/combos/projects-combos'
import { StatusBadge } from './components/status-badge'
import { UnblockProjectModal } from './components/unblock-project-modal'
import { AdaptedProjects, adaptProjectsToTable } from './projects-page-utils'

const ProjectsPage = () => {
  const { t } = useTranslation()
  const [tableProjects, setTableProjects] = useState<AdaptedProjects[]>([])
  const [organizationName, setOrganizationName] = useState<string>('')
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false)
  const [showUnblockModal, setShowUnblockModal] = useState<boolean>(false)
  const [selectedProject, setSelectedProject] = useState<Project>()
  const [lastSelectedOrganizationWithStatus, setLastSelectedOrganizationWithStatus] =
    useState<OrganizationWithStatus>()
  const isMobile = useIsMobile()

  const {
    isLoading: isLoadingProjectsList,
    result: projectList = [],
    executeUseCase: getProjectsListQry
  } = useExecuteUseCaseOnMount(GetProjectsListQry)

  const applyFilters = async (organization: Organization, status: ProjectStatus): Promise<void> => {
    if (organization?.id) {
      setOrganizationName(organization.name)
      const organizationWithStatus: OrganizationWithStatus = {
        organizationId: organization.id,
        open: status.value
      }
      await getProjectsListQry(organizationWithStatus)
      setLastSelectedOrganizationWithStatus(organizationWithStatus)
    }
  }

  useSubscribeToUseCase(
    BlockProjectCmd,
    () => getProjectsListQry(lastSelectedOrganizationWithStatus),
    [lastSelectedOrganizationWithStatus]
  )
  useSubscribeToUseCase(
    UnblockProjectCmd,
    () => getProjectsListQry(lastSelectedOrganizationWithStatus),
    [lastSelectedOrganizationWithStatus]
  )

  useEffect(() => {
    if (!isLoadingProjectsList) {
      setTableProjects(adaptProjectsToTable(organizationName, projectList))
    }
  }, [isLoadingProjectsList, projectList])

  const onCloseBlockModal = () => {
    setShowBlockModal(false)
  }

  const onCloseUnblockModal = () => {
    setShowUnblockModal(false)
    setShowBlockModal(false)
  }

  const onShowUnblockModal = () => {
    setShowUnblockModal(true)
    setShowBlockModal(false)
  }

  const onCancelUnblockModal = () => {
    setShowUnblockModal(false)
    setShowBlockModal(true)
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
      showLabelInMobile: true,
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
        if (!project.open) return null

        return (
          <Button
            key={'action' + project.id}
            colorScheme="blue"
            variant="ghost"
            marginLeft={isMobile ? 'auto' : ''}
            display={isMobile ? 'block' : ''}
            onClick={() => {
              setSelectedProject(project)
              setShowBlockModal(true)
            }}
          >
            {project.blockDate ? t('project_modal.edit_block') : t('project_modal.block')}
          </Button>
        )
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

      {showBlockModal && selectedProject && (
        <BlockProjectModal
          project={selectedProject}
          onClose={onCloseBlockModal}
          onCancel={onCloseBlockModal}
          onUnblockPressed={onShowUnblockModal}
        />
      )}

      {selectedProject && showUnblockModal && (
        <UnblockProjectModal
          project={selectedProject}
          onCancel={onCancelUnblockModal}
          onClose={onCloseUnblockModal}
        />
      )}
    </PageWithTitle>
  )
}

export default ProjectsPage

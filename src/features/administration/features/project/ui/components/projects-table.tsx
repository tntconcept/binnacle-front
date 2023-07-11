import { Button } from '@chakra-ui/react'
import { Organization } from 'features/binnacle/features/organization/domain/organization'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from 'shared/arch/hooks/use-subscribe-to-use-case'
import { Table } from 'shared/components/table/table'
import { ColumnsProps } from 'shared/components/table/table.types'
import { useIsMobile } from 'shared/hooks'
import { BlockProjectCmd } from '../../application/block-project-cmd'
import { GetProjectsListQry } from '../../application/get-projects-list-qry'
import { UnblockProjectCmd } from '../../application/unblock-project-cmd'
import { OrganizationWithStatus } from '../../domain/organization-status'
import { Project } from '../../domain/project'
import { ProjectStatus } from '../../domain/project-status'
import { AdaptedProjects, adaptProjectsToTable } from '../projects-page-utils'
import { ProjectsFilterFormCombos } from './combos/projects-combos'
import { StatusBadge } from './status-badge'

interface Props {
  onProjectClicked(project: Project): void
}

export const ProjectsTable: FC<Props> = (props) => {
  const { onProjectClicked } = props
  const { t } = useTranslation()
  const [organizationName, setOrganizationName] = useState<string>('')
  const [lastSelectedOrganizationWithStatus, setLastSelectedOrganizationWithStatus] =
    useState<OrganizationWithStatus>()
  const [tableProjects, setTableProjects] = useState<AdaptedProjects[]>([])
  const isMobile = useIsMobile()

  const {
    isLoading: isLoadingProjectsList,
    result: projectList = [],
    executeUseCase: getProjectsListQry
  } = useExecuteUseCaseOnMount(GetProjectsListQry)

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

  const columns: ColumnsProps[] = useMemo(
    () => [
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
                onProjectClicked(project)
              }}
            >
              {project.blockDate ? t('project_modal.edit_block') : t('project_modal.block')}
            </Button>
          )
        }
      }
    ],
    []
  )

  return (
    <>
      <ProjectsFilterFormCombos onFiltersChange={applyFilters} />
      <Table
        columns={columns}
        dataSource={tableProjects}
        emptyTableKey={'projects.filter_required'}
      ></Table>
    </>
  )
}

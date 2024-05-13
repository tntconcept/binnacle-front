import { Button } from '@chakra-ui/react'
import { Organization } from '../../../../../binnacle/features/organization/domain/organization'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from '../../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { Table } from '../../../../../../shared/components/table/table'
import { ColumnsProps } from '../../../../../../shared/components/table/table.types'
import { BlockProjectCmd } from '../../application/block-project-cmd'
import { GetProjectsWithBlockerUserName } from '../../application/get-projects-with-blocker-user-name'
import { UnblockProjectCmd } from '../../application/unblock-project-cmd'
import { ProjectStatus } from '../../domain/project-status'
import { AdaptedProjects, adaptProjectsToTable } from '../projects-page-utils'
import { ProjectsFilterFormCombos } from './combos/projects-combos'
import { StatusBadge } from './status-badge'
import { useIsMobile } from '../../../../../../shared/hooks/use-is-mobile'
import { Project } from '../../../../../shared/project/domain/project'
import { ProjectOrganizationFilters } from '../../../../../shared/project/domain/project-organization-filters'

interface Props {
  onProjectClicked(project: Project): void
}

export const ProjectsTable: FC<Props> = (props) => {
  const { onProjectClicked } = props
  const { t } = useTranslation()
  const [organizationName, setOrganizationName] = useState<string>('')
  const [lastSelectedOrganizationWithStatus, setLastSelectedOrganizationWithStatus] =
    useState<ProjectOrganizationFilters>()
  const [tableProjects, setTableProjects] = useState<AdaptedProjects[]>([])
  const isMobile = useIsMobile()

  const {
    isLoading: isLoadingProjectsList,
    result: projectList = [],
    executeUseCase: getProjectsListQry
  } = useExecuteUseCaseOnMount(GetProjectsWithBlockerUserName)

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
  }, [isLoadingProjectsList, organizationName, projectList])

  const applyFilters = useCallback(
    async (organization: Organization, status: ProjectStatus) => {
      if (organization?.id) {
        setOrganizationName(organization.name)
        const organizationWithStatus: ProjectOrganizationFilters = {
          organizationIds: [organization.id],
          open: status.value
        }
        await getProjectsListQry(organizationWithStatus)
        setLastSelectedOrganizationWithStatus(organizationWithStatus)
      }
    },
    [getProjectsListQry]
  )

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
        title: 'projects.projectType',
        dataIndex: 'projectBillingType',
        key: 'projectBillingType'
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
    [isMobile, onProjectClicked, t]
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

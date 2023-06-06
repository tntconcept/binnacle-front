import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { useTranslation } from 'react-i18next'
import { ProjectsFilterFormCombos } from './components/combos/projects-combos'
import Table from '../../../../../shared/components/table/table'
import { useEffect, useState } from 'react'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'
import { Button } from '@chakra-ui/react'
import { useIsMobile } from '../../../../../shared/hooks'
import { GetProjectsListQry } from '../application/get-projects-list-qry'
import { AdaptedProjects, adaptProjectsToTable } from './projects-page-utils'
import { Project } from '../domain/project'
import { StatusBadge } from './components/status-badge'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { SubmitHandler } from 'react-hook-form'
import { ProjectsFilterFormSchema } from './components/projects-filter-form.schema'

const ProjectsPage = () => {
  const { t } = useTranslation()
  const [tableProjects, setTableProjects] = useState<AdaptedProjects[]>([])
  const [organizationName, setOrganizationName] = useState<string>('')
  const isMobile = useIsMobile()

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

  const columns: ColumnsProps[] = [
    {
      title: 'projects.organization',
      dataIndex: 'organization',
      key: 'organization',
      showInMobile: true
    },
    {
      title: 'projects.project',
      dataIndex: 'project',
      key: 'project'
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
      showInMobile: true,
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
              onClick={() => {}}
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
              onClick={() => {}}
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
    </PageWithTitle>
  )
}

export default ProjectsPage

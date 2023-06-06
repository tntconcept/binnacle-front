import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { useTranslation } from 'react-i18next'
import { ProjectsFilterFormCombos } from './components/combos/projects-combos'
import { Organization } from '../../../../binnacle/features/organization/domain/organization'
import { Status } from '../domain/status'
import Table from '../../../../../shared/components/table/table'
import { useState } from 'react'
import { ColumnsProps } from '../../../../../shared/components/table/table.types'
import { Activity } from '../../../../binnacle/features/activity/domain/activity'
import { Button } from '@chakra-ui/react'
import { useIsMobile } from '../../../../../shared/hooks'
import { ProjectMother } from '../domain/tests/project-mother'

const ProjectsPage = () => {
  const { t } = useTranslation()
  const [tableProjects] = useState<any>(ProjectMother.tableProjectsList())
  const isMobile = useIsMobile()
  const applyFilters = (organization?: Organization, status?: Status) => {
    console.log('>> filtro', organization, status)
    //setTableProjects([])
  }

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
      showInMobile: true
    },
    {
      title: 'projects.billable',
      dataIndex: 'billable',
      key: 'billable'
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
      render: (activity: Activity) => (
        <Button
          key={'action' + activity.id}
          colorScheme="blue"
          variant="ghost"
          size="sm"
          marginLeft={isMobile ? 'auto' : ''}
          display={isMobile ? 'block' : ''}
          onClick={() => {}}
        >
          {t('actions.show')}
        </Button>
      )
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

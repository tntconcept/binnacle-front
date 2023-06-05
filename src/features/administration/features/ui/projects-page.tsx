import { PageWithTitle } from '../../../../shared/components/page-with-title/page-with-title'
import { useTranslation } from 'react-i18next'

const ProjectsPage = () => {
  const { t } = useTranslation()
  return <PageWithTitle title={t('pages.projects')}></PageWithTitle>
}

export default ProjectsPage

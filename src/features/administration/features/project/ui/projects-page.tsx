import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { Project } from '../domain/project'
import { BlockProjectModal } from './components/block-project-modal'
import { ProjectsTable } from './components/projects-table'
import { UnblockProjectModal } from './components/unblock-project-modal'

const ProjectsPage: FC = () => {
  const { t } = useTranslation()
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false)
  const [showUnblockModal, setShowUnblockModal] = useState<boolean>(false)
  const [selectedProject, setSelectedProject] = useState<Project>()

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

  return (
    <PageWithTitle title={t('pages.projects')}>
      <ProjectsTable
        onProjectClicked={(project: Project) => {
          setSelectedProject(project)
          setShowBlockModal(true)
        }}
      />
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

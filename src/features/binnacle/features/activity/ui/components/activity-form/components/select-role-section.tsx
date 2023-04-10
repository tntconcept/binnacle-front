import { Box } from '@chakra-ui/react'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import { FC, useState } from 'react'
import { Control, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityFormSchema } from '../activity-form.schema'
import { Combos } from './combos/combos'
import RecentRolesList from './recent-roles-list'
import ToggleButton from './toggle-button'

interface Props {
  gridArea: string
  control: Control<ActivityFormSchema>
  onSelect(projectRole: ProjectRole): void
}

export const SelectRoleSection: FC<Props> = (props: Props) => {
  const { gridArea, control, onSelect } = props
  const { t } = useTranslation()
  const [showRecentRole, setShowRecentRole] = useState(true)
  const [projectRole] = useWatch({
    control: control,
    name: ['projectRole']
  })

  return (
    <Box gridArea={gridArea} position="relative" mb="4">
      <Box
        border="none"
        p={0}
        m={0}
        position="relative"
        role="group"
        aria-labelledby="selects_head"
      >
        <Box id="selects_head" mb={4}>
          <span>
            {showRecentRole ? t('activity_form.recent_roles') : t('activity_form.select_role')}
          </span>
        </Box>
        {projectRole && (
          <ToggleButton
            showRecentRoles={showRecentRole}
            onToggle={() => setShowRecentRole(!showRecentRole)}
          />
        )}
        {showRecentRole ? (
          <RecentRolesList projectRole={projectRole} onSelect={onSelect} />
        ) : (
          <Combos />
        )}
      </Box>
    </Box>
  )
}

import { Box } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { Control, useController } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityFormCombos } from './combos/activity-form-combos'
import RecentRolesList from './recent-roles-list'
import ToggleButton from './toggle-button'

interface Props {
  gridArea: string
  control: Control<any>
  isReadOnly?: boolean
}

export const SelectRoleSection: FC<Props> = (props: Props) => {
  const { gridArea, control, isReadOnly } = props
  const { t } = useTranslation()
  const { field: showRecentRoleField } = useController({ control, name: 'showRecentRole' })
  const { field: recentProjectRoleField } = useController({ control, name: 'recentProjectRole' })
  const { field: organizationField } = useController({ control, name: 'organization' })
  const { field: projectField } = useController({ control, name: 'project' })
  const { field: projectRoleField } = useController({ control, name: 'projectRole' })
  const [recentRoleListIsEmpty, setRecentRoleListIsEmpty] = useState(false)

  const clearCombos = () => {
    organizationField.onChange(undefined)
    projectField.onChange(undefined)
    projectRoleField.onChange(undefined)
  }

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
        {!isReadOnly && (
          <Box id="selects_head" mb={4}>
            <span>
              {showRecentRoleField.value
                ? t('activity_form.recent_roles')
                : t('activity_form.select_role')}
            </span>
          </Box>
        )}
        {!recentRoleListIsEmpty && !isReadOnly && (
          <ToggleButton
            showRecentRoles={showRecentRoleField.value}
            onToggle={() => {
              clearCombos()
              showRecentRoleField.onChange(!showRecentRoleField.value)
            }}
          />
        )}
        {showRecentRoleField.value && !isReadOnly ? (
          <RecentRolesList
            onEmptyList={() => {
              setRecentRoleListIsEmpty(true)
              showRecentRoleField.onChange(false)
            }}
            onChange={(value) => {
              recentProjectRoleField.onChange(value)
            }}
            projectRole={recentProjectRoleField.value}
          />
        ) : (
          <ActivityFormCombos control={control} isReadOnly={isReadOnly} />
        )}
      </Box>
    </Box>
  )
}

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
}

export const SelectRoleSection: FC<Props> = (props: Props) => {
  const { gridArea, control } = props
  const { t } = useTranslation()
  const { field: showRecentRoleField } = useController({ control, name: 'showRecentRole' })
  const { field: recentProjectRoleField } = useController({ control, name: 'recentProjectRole' })
  const { field: billableField } = useController({ control, name: 'billable' })
  const [recentRoleListIsEmpty, setRecentRoleListIsEmpty] = useState(false)

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
            {showRecentRoleField.value
              ? t('activity_form.recent_roles')
              : t('activity_form.select_role')}
          </span>
        </Box>
        {!recentRoleListIsEmpty && (
          <ToggleButton
            showRecentRoles={showRecentRoleField.value}
            onToggle={() => showRecentRoleField.onChange(!showRecentRoleField.value)}
          />
        )}
        {showRecentRoleField.value ? (
          <RecentRolesList
            onEmptyList={() => {
              setRecentRoleListIsEmpty(true)
              showRecentRoleField.onChange(false)
            }}
            onChange={(value) => {
              recentProjectRoleField.onChange(value)
              billableField.onChange(value.project.billable)
            }}
            projectRole={recentProjectRoleField.value}
          />
        ) : (
          <ActivityFormCombos control={control} />
        )}
      </Box>
    </Box>
  )
}

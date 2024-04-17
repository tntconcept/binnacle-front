import { Box } from '@chakra-ui/react'
import { FC, useRef } from 'react'
import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityFormCombos } from './combos/activity-form-combos'
import { Id } from '../../../../../../../../shared/types/id'

interface Props {
  gridArea: string
  control: Control<any>
  isReadOnly?: boolean
  userId?: Id
}

export const SelectRoleSectionWithoutRecentRole: FC<Props> = (props: Props) => {
  const { gridArea, control, isReadOnly } = props
  const { t } = useTranslation()
  //   const { field: showRecentRoleField } = useController({ control, name: 'showRecentRole' })
  //   const { field: recentProjectRoleField } = useController({ control, name: 'recentProjectRole' })
  //   const [recentRoleListIsEmpty, setRecentRoleListIsEmpty] = useState(false)
  const organizationRef = useRef<HTMLInputElement>(null)

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
            <span>{t('activity_form.select_role')}</span>
          </Box>
        )}
        {/* {!recentRoleListIsEmpty && !isReadOnly && (
          <ToggleButton
            showRecentRoles={showRecentRoleField.value}
            onToggle={() => {
              showRecentRoleField.onChange(!showRecentRoleField.value)
              focusAfterRender()
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
        ) : ( */}
        <ActivityFormCombos
          ref={organizationRef}
          userId={props.userId}
          control={control}
          isReadOnly={isReadOnly}
        />
      </Box>
    </Box>
  )
}

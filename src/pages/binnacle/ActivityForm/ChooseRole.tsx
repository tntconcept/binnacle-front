import React from 'react'
import ToggleRecentRolesButton from 'pages/binnacle/ActivityForm/ToggleRecentRolesButton'
import RecentRolesList from 'pages/binnacle/ActivityForm/RecentRolesList'
import SelectRole from 'pages/binnacle/ActivityForm/SelectRole'
import { useTranslation } from 'react-i18next'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { useFormikContext } from 'formik'
import { ActivityFormValues } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import { Box } from '@chakra-ui/core'

interface IChooseRole {
  showRecentRoles: boolean
  toggleRecentRoles: (state: boolean) => void
  recentRoleExists?: IRecentRole
}

const ChooseRole: React.FC<IChooseRole> = ({
  showRecentRoles,
  toggleRecentRoles,
  recentRoleExists
}) => {
  const { t } = useTranslation()

  const formik = useFormikContext<ActivityFormValues>()

  const handleToggleRecentRoles = (state: boolean) => {
    if (!state) {
      formik.setValues(
        {
          ...formik.values,
          organization: undefined,
          project: undefined,
          role: undefined
        },
        false
      )
    } else if (state && recentRoleExists) {
      formik.setFieldValue(
        'role',
        {
          id: recentRoleExists.id,
          name: recentRoleExists.name
        },
        false
      )
    }
    toggleRecentRoles(state)
  }

  return (
    <Box gridColumn={['col / span 6']} position="relative">
      <Box
        border="none"
        p={0}
        m={0}
        position="relative"
        role="group"
        aria-labelledby="selects_head"
      >
        <Box id="selects_head" mb={4}>
          {showRecentRoles ? t('activity_form.recent_roles') : t('activity_form.select_role')}
        </Box>
        {recentRoleExists && (
          <ToggleRecentRolesButton
            showRecentRoles={showRecentRoles}
            onToggle={handleToggleRecentRoles}
            recentRoleExist={recentRoleExists}
          />
        )}
        {showRecentRoles ? <RecentRolesList /> : <SelectRole />}
      </Box>
    </Box>
  )
}

export default ChooseRole

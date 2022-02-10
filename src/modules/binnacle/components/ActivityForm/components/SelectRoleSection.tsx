import { Box } from "@chakra-ui/react";
import RecentRolesList from "modules/binnacle/components/ActivityForm/components/RecentRolesList";
import { Combos } from "modules/binnacle/components/ActivityForm/components/Combos/Combos";
import ToggleButton from "modules/binnacle/components/ActivityForm/components/ToggleButton";
import type { RecentRole } from "modules/binnacle/data-access/interfaces/recent-role";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ActivityFormSchema } from "../ActivityForm.schema";

interface Props {
  gridArea: string
  control: Control<ActivityFormSchema>
  onToggleRecentRoles: () => void
  onSelectRoleCard: (role: RecentRole) => void
}

function SelectRoleSection(props: Props) {
  const { t } = useTranslation();

  const [showRecentRole, recentRole] = useWatch({
    control: props.control,
    name: ['showRecentRole', 'recentRole']
  })

  return (
    <Box gridArea={props.gridArea} position="relative">
      <Box
        border="none"
        p={0}
        m={0}
        position="relative"
        role="group"
        aria-labelledby="selects_head"
      >
        <Box id="selects_head" mb={4}>
          {showRecentRole ? t('activity_form.recent_roles') : t('activity_form.select_role')}
        </Box>
        {recentRole && (
          <ToggleButton
            showRecentRoles={showRecentRole as boolean}
            onToggle={props.onToggleRecentRoles}
          />
        )}
        {showRecentRole ? (
          <RecentRolesList
            recentRole={recentRole as RecentRole}
            onSelectRoleCard={props.onSelectRoleCard}
          />
        ) : (
          <Combos />
        )}
      </Box>
    </Box>
  )
}

export default SelectRoleSection

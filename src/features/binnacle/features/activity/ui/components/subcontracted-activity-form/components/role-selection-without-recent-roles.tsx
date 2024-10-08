import { Box } from '@chakra-ui/react'
import { FC, useRef } from 'react'
import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ActivityFormCombos } from '../../activity-form/components/combos/activity-form-combos'
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

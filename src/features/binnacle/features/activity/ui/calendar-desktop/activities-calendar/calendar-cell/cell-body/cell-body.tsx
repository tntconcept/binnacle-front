import { Box } from '@chakra-ui/react'
import type { FC } from 'react'
import { FocusOn } from 'react-focus-on'
import { useTranslation } from 'react-i18next'
import ButtonVisuallyHidden from 'shared/components/ButtonVisuallyHidden'
import { ActivityWithRenderDays } from '../../types/activity-with-render-days'
import { CellActivityButton } from '../cell-activity-button/cell-activity-button'

interface Props {
  isSelected: boolean
  onEscKey: (v: any) => void
  activities: ActivityWithRenderDays[]
}

export const CellBody: FC<Props> = (props) => {
  // announce and trap the focus and focus new activity button
  // on escape key focus the cell header and announce
  // cell body content should not be in the tab order if the cell is not selected

  const { t } = useTranslation()

  return (
    <Box maxHeight="calc(100% - 24px)" paddingTop="4px" overflowY="auto">
      <FocusOn
        enabled={props.isSelected}
        onEscapeKey={props.onEscKey}
        scrollLock={false}
        noIsolation={true}
      >
        <ButtonVisuallyHidden tabIndex={props.isSelected ? 0 : -1}>
          {t('accessibility.new_activity')}
        </ButtonVisuallyHidden>
        {props.activities.map((activity) => (
          <CellActivityButton
            key={activity.id}
            activity={activity}
            canFocus={props.isSelected}
            // TODO: edit activity
            onClick={() => {}}
          />
        ))}
      </FocusOn>
    </Box>
  )
}

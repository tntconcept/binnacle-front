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
  onActivityClicked: (activity: ActivityWithRenderDays) => void
}

export const CellBody: FC<Props> = (props) => {
  // announce and trap the focus and focus new activity button
  // on escape key focus the cell header and announce
  // cell body content should not be in the tab order if the cell is not selected

  const { t } = useTranslation()
  const activitiesInDays = props.activities.filter((a) => a.interval.timeUnit === 'DAYS')
  const restOfActivities = props.activities.filter((a) => a.interval.timeUnit !== 'DAYS')
  const firstRestOfActivities = restOfActivities.at(0)

  return (
    <>
      {activitiesInDays.map((activity) => (
        <CellActivityButton
          key={activity.id}
          activity={activity}
          canFocus={props.isSelected}
          onClick={props.onActivityClicked}
        />
      ))}

      <Box height="calc(100% - 24px)" paddingTop="4px" position="relative" zIndex="0">
        <FocusOn
          enabled={props.isSelected}
          onEscapeKey={props.onEscKey}
          scrollLock={false}
          noIsolation={true}
          style={{
            height: firstRestOfActivities
              ? `calc(100% - ${firstRestOfActivities.renderIndex} * 1.75rem)`
              : '100%',
            overflowY: 'auto',
            zIndex: '0',
            marginTop: firstRestOfActivities
              ? `calc(${firstRestOfActivities.renderIndex} * 1.75rem)`
              : '0'
          }}
        >
          <ButtonVisuallyHidden tabIndex={props.isSelected ? 0 : -1}>
            {t('accessibility.new_activity')}
          </ButtonVisuallyHidden>
          {restOfActivities.map((activity) => (
            <CellActivityButton
              key={activity.id}
              activity={activity}
              canFocus={props.isSelected}
              onClick={props.onActivityClicked}
            />
          ))}
        </FocusOn>
      </Box>
    </>
  )
}

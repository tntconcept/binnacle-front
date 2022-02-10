import { Box, Icon, Portal, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react'
import {
  ClockIcon,
  CurrencyEuroIcon,
  OfficeBuildingIcon,
  PhotographIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/outline'
import { observer } from 'mobx-react'
import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { getDurationByMinutes } from 'modules/binnacle/data-access/utils/getDuration'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import { getHumanizedDuration } from 'shared/utils/chrono'

interface Props {
  activity: Activity
  setTooltipRef: any
  getTooltipProps: any
  getArrowProps: any
}

export const ActivityPreview = observer((props: Props) => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)

  const a11yLabel = `
    ${t('activity_form.organization')}: ${props.activity.organization.name},
    ${t('activity_form.project')}: ${props.activity.project.name},
    ${t('activity_form.role')}: ${props.activity.projectRole.name},
    ${t('activity_form.duration')}: ${getHumanizedDuration(props.activity.duration, false)},
    ${props.activity.billable ? t('activity_form.billable') + ',' : ''}
    ${props.activity.hasImage ? t('activity_form.image') + ',' : ''}
  `
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Portal>
      <Box
        role="tooltip"
        data-testid="activity_tooltip"
        ref={props.setTooltipRef}
        {...props.getTooltipProps({ className: 'tooltip-container' })}
      >
        <Box
          _after={{
            borderColor: bg
          }}
          {...props.getArrowProps({ className: 'tooltip-arrow' })}
        />
        <Box maxWidth="600px" bg={bg}>
          <div aria-label={a11yLabel}>
            <div>
              <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                <Icon as={OfficeBuildingIcon} mr={1} color="gray.400" />
                {props.activity.organization.name}
              </Text>
              <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                <Icon as={UsersIcon} mr={1} color="gray.400" />
                {props.activity.project.name}
              </Text>
              <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                <Icon as={UserIcon} mr={1} color="gray.400" />
                {props.activity.projectRole.name}
              </Text>
            </div>
            <div>
              <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                <Icon as={ClockIcon} mr={1} color="gray.400" />
                <span aria-label={getHumanizedDuration(props.activity.duration, false)}>
                  {getDurationByMinutes(props.activity.duration, settings.useDecimalTimeFormat)}
                </span>
              </Text>
              {props.activity.billable && (
                <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                  <Icon as={CurrencyEuroIcon} mr={1} color="gray.400" />
                  {t('activity_form.billable')}
                </Text>
              )}
              {props.activity.hasImage && (
                <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                  <Icon as={PhotographIcon} mr={1} color="gray.400" />
                  {t('activity_form.image')}
                </Text>
              )}
            </div>
          </div>
          <Text noOfLines={3}>
            <VisuallyHidden>{t('activity_form.description') + ':'}</VisuallyHidden>
            {props.activity.description}
          </Text>
        </Box>
      </Box>
    </Portal>
  )
})

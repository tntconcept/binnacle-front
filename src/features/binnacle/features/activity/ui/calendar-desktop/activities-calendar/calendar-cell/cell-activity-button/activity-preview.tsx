import { Box, Icon, Portal, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react'
import {
  ClockIcon,
  CurrencyEuroIcon,
  OfficeBuildingIcon,
  PhotographIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { getDurationByMinutes } from 'features/binnacle/features/activity/utils/getDuration'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getHumanizedDuration } from 'shared/utils/chrono'
import { ActivityWithRenderDays } from '../../types/activity-with-render-days'

interface Props {
  activity: ActivityWithRenderDays
  setTooltipRef: any
  getTooltipProps: any
  getArrowProps: any
  useDecimalTimeFormat: boolean
}

export const ActivityPreview = (props: Props) => {
  const { activity, useDecimalTimeFormat } = props
  const { t } = useTranslation()
  const humanizedDuration = useMemo(() => {
    return getHumanizedDuration({
      duration: activity.interval.duration,
      abbreviation: false,
      timeUnit: activity.interval.timeUnit
    })
  }, [activity])

  const isMinutesActivity = activity.interval.timeUnit === 'MINUTES'

  const a11yLabel = `
    ${t('activity_form.organization')}: ${activity.organization.name},
    ${t('activity_form.project')}: ${activity.project.name},
    ${t('activity_form.role')}: ${activity.projectRole.name},
    ${t('activity_form.duration')}: ${humanizedDuration},
    ${activity.billable ? t('activity_form.billable') + ',' : ''}
    ${activity.hasEvidences ? t('activity_form.image') + ',' : ''}
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
                {activity.organization.name}
              </Text>
              <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                <Icon as={UsersIcon} mr={1} color="gray.400" />
                {activity.project.name}
              </Text>
              <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                <Icon as={UserIcon} mr={1} color="gray.400" />
                {activity.projectRole.name}
              </Text>
            </div>
            <div>
              <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                <Icon as={ClockIcon} mr={1} color="gray.400" />
                <span aria-label={humanizedDuration}>
                  {isMinutesActivity
                    ? getDurationByMinutes(activity.interval.duration, useDecimalTimeFormat)
                    : humanizedDuration}
                </span>
              </Text>
              {activity.billable && (
                <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                  <Icon as={CurrencyEuroIcon} mr={1} color="gray.400" />
                  {t('activity_form.billable')}
                </Text>
              )}
              {activity.hasEvidences && (
                <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                  <Icon as={PhotographIcon} mr={1} color="gray.400" />
                  {t('activity_form.image')}
                </Text>
              )}
              {activity.projectRole.requireApproval && (
                <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                  {activity.approvalState === 'ACCEPTED' && (
                    <>
                      <Icon as={CheckCircleIcon} mr={1} color="gray.400" />
                      {t('activity_form.state_approved')}
                    </>
                  )}
                  {activity.approvalState === 'PENDING' && (
                    <>
                      <Icon as={QuestionMarkCircleIcon} mr={1} color="gray.400" />
                      {t('activity_form.state_pending')}
                    </>
                  )}
                </Text>
              )}
            </div>
          </div>
          <Text noOfLines={3}>
            <VisuallyHidden>{t('activity_form.description') + ':'}</VisuallyHidden>
            {activity.description}
          </Text>
        </Box>
      </Box>
    </Portal>
  )
}

import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import { paths } from 'shared/router/paths'
import { ActivityForm, ACTIVITY_FORM_ID } from '../components/activity-form/activity-form'
import { ActivityFormProvider } from '../components/activity-form/activity-form-provider'
import RemoveActivityButton from '../components/activity-form/components/remove-activity-button'
import { ActivityFormNavbar } from './activity-form-navbar'

export const ActivityFormScreen = observer(() => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { selectedActivityDate, activity, lastEndTime } = useGlobalState(ActivityFormState)

  return (
    <Box height="inherit">
      <ActivityFormNavbar date={selectedActivityDate} />
      <ActivityFormProvider
        date={selectedActivityDate}
        activity={activity}
        lastEndTime={lastEndTime}
        onAfterSubmit={() => navigate(paths.binnacle)}
      >
        <Flex
          direction="column"
          justify="space-between"
          height="calc(100% - 50px)"
          top="50px"
          position="relative"
        >
          <ActivityForm />
          <Flex
            justify={activity ? 'space-between' : 'flex-end'}
            align="center"
            p="0 1rem 1rem"
            w="100%"
          >
            {activity && (
              <RemoveActivityButton
                activity={activity}
                onDeleted={() => navigate(paths.binnacle)}
              />
            )}
            <SubmitButton formId={ACTIVITY_FORM_ID}>{t('actions.save')}</SubmitButton>
          </Flex>
        </Flex>
      </ActivityFormProvider>
    </Box>
  )
})

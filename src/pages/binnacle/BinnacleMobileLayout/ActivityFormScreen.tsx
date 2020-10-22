import React from 'react'
import { ActivityForm } from 'pages/binnacle/ActivityForm'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { IActivity } from 'api/interfaces/IActivity'
import { ReactComponent as ArrowLeft } from 'heroicons/outline/chevron-left.svg'
import { formatDayAndMonth } from 'utils/DateUtils'
import { useTranslation } from 'react-i18next'
import { ActivityFormLogic } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import RemoveActivityButton from 'pages/binnacle/ActivityForm/RemoveActivityButton'
import { Button, Flex, Icon } from '@chakra-ui/core'

interface IActivityPageLocation {
  date: Date
  activity?: IActivity
  lastEndTime?: Date
}

export const ActivityFormScreen = () => {
  const { t } = useTranslation()
  const location = useLocation<IActivityPageLocation>()
  const history = useHistory()

  return (
    <>
      <Navbar date={location.state.date} />
      <ActivityFormLogic
        date={location.state.date}
        activity={location.state.activity}
        lastEndTime={location.state.lastEndTime}
        onAfterSubmit={() => history.push('/binnacle', location.state.date)}
      >
        {(formik, utils) => (
          <>
            <ActivityForm formik={formik} utils={utils} />
            <Flex
              justify={utils.activity ? 'space-between' : 'flex-end'}
              align="center"
              p="0 1rem 1rem"
              w="100%"
            >
              {utils.activity && (
                <RemoveActivityButton
                  activity={utils.activity}
                  onDeleted={() => history.push('/binnacle', location.state.date)}
                />
              )}
              <Button
                data-testid="save_activity"
                colorScheme="brand"
                type="button"
                onClick={formik.handleSubmit as any}
                isLoading={formik.isSubmitting || utils.isPending}
              >
                {t('actions.save')}
              </Button>
            </Flex>
          </>
        )}
      </ActivityFormLogic>
    </>
  )
}

function Navbar(props: { date: Date }) {
  const { t } = useTranslation()

  return (
    <Flex as="nav" height="50px" align="center" justify="space-between" pr="16px">
      <Button
        as={Link}
        to={{
          pathname: '/binnacle',
          state: props.date
        }}
        leftIcon={<Icon as={ArrowLeft} boxSize={6} />}
        variant="unstyled"
        p="0 10px"
        d="flex"
      >
        {t('actions.back')}
      </Button>
      <span>{formatDayAndMonth(props.date)}</span>
    </Flex>
  )
}

import React from 'react'
import { ActivityForm } from 'pages/binnacle/ActivityForm'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { IActivity } from 'api/interfaces/IActivity'
import { ReactComponent as ArrowLeft } from 'assets/icons/chevron-left.svg'
import styles from 'pages/binnacle/BinnacleMobileLayout/ActivityFormScreen.module.css'
import { formatDayAndMonth } from 'utils/DateUtils'
import { useTranslation } from 'react-i18next'
import { ActivityFormLogic } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import RemoveActivityButton from 'pages/binnacle/ActivityForm/RemoveActivityButton'
import { Button, Flex } from '@chakra-ui/core'

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
    <div className={styles.container}>
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
              position="absolute"
              bottom={0}
              p={4}
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
                colorScheme="blue"
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
    </div>
  )
}

function Navbar(props: { date: Date }) {
  const { t } = useTranslation()

  return (
    <nav className={styles.baseNav}>
      <Link
        to={{
          pathname: '/binnacle',
          state: props.date
        }}
        className={styles.backLink}
      >
        <ArrowLeft />
        {t('actions.back')}
      </Link>
      <span>{formatDayAndMonth(props.date)}</span>
    </nav>
  )
}

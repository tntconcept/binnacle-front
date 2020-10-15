import React, { useEffect, useRef, useState } from 'react'
import DateTime from 'services/DateTime'
import { getDate } from 'date-fns'
import { ActivityForm } from 'pages/binnacle/ActivityForm'
import { IActivity } from 'api/interfaces/IActivity'
import { useTranslation } from 'react-i18next'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VisuallyHidden,
  Button
} from '@chakra-ui/core'
import RemoveActivityButton from 'pages/binnacle/ActivityForm/RemoveActivityButton'
import { ActivityFormLogic } from 'pages/binnacle/ActivityForm/ActivityFormLogic'

interface ActivityModalData {
  date: Date
  lastEndTime: Date | undefined
  activity: IActivity | undefined
}

type CalendarModalContext = (data: ActivityModalData) => void

export const CalendarModalContext = React.createContext<CalendarModalContext>(undefined!)

export const CalendarModal: React.FC = (props) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const [activityData, setActivityData] = useState<ActivityModalData>({
    date: new Date(),
    lastEndTime: undefined,
    activity: undefined
  })

  const justMounted = useRef(true)
  useEffect(() => {
    if (!justMounted.current) {
      setIsOpen(true)
    }
    justMounted.current = false
  }, [activityData])

  return (
    <CalendarModalContext.Provider value={setActivityData}>
      {props.children}
      <Modal
        onClose={() => setIsOpen(false)}
        isOpen={modalIsOpen}
        scrollBehavior="inside"
        isCentered={true}
        size="2xl"
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <VisuallyHidden id="modal-title">
                {activityData.activity
                  ? t('accessibility.edit_activity') + ':'
                  : t('accessibility.new_activity') + ':'}
                {DateTime.format(activityData.date, 'dd MMMM')}
              </VisuallyHidden>
              <b style={{ fontSize: 18 }}>{getDate(activityData.date)}</b>
              {DateTime.format(activityData.date, ' MMMM')}
            </ModalHeader>
            <ModalCloseButton />
            <ActivityFormLogic
              date={activityData.date}
              lastEndTime={activityData.lastEndTime}
              activity={activityData.activity}
              onAfterSubmit={() => setIsOpen(false)}
            >
              {(formik, utils) => (
                <>
                  <ModalBody>
                    <ActivityForm formik={formik} utils={utils} />
                  </ModalBody>
                  <ModalFooter
                    justifyContent={activityData.activity ? 'space-between' : 'flex-end'}
                  >
                    {activityData.activity && (
                      <RemoveActivityButton
                        activity={activityData.activity}
                        onDeleted={() => setIsOpen(false)}
                      />
                    )}
                    <Button
                      data-testid="save_activity"
                      colorScheme="blue"
                      type="button"
                      onClick={formik.handleSubmit}
                      isLoading={formik.isSubmitting || utils.isPending}
                    >
                      {t('actions.save')}
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ActivityFormLogic>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </CalendarModalContext.Provider>
  )
}

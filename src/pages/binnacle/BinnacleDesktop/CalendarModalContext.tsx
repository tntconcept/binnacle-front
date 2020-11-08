import React, { useEffect, useRef, useState } from 'react'
import { ActivityForm } from 'pages/binnacle/ActivityForm'
import { IActivity } from 'core/api/interfaces'
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
import chrono from 'core/services/Chrono'

interface ActivityModalData {
  date: Date
  lastEndTime: Date | undefined
  activity: IActivity | undefined
}

type CalendarModalContextType = (data: ActivityModalData) => void

export const CalendarModalContext = React.createContext<CalendarModalContextType>(undefined!)

export const CalendarModal: React.FC = (props) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const [activityData, setActivityData] = useState<ActivityModalData>({
    date: chrono.now(),
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
                {chrono(activityData.date).format('dd MMMM')}
              </VisuallyHidden>
              <b style={{ fontSize: 18 }}>{activityData.date.getDate()}</b>
              {chrono(activityData.date).format(' MMMM')}
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
                      colorScheme="brand"
                      type="button"
                      onClick={formik.handleSubmit as any}
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

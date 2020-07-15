import React, { useEffect, useRef, useState } from 'react'
import { Modal, VisuallyHidden } from 'common/components'
import DateTime from 'services/DateTime'
import { getDate } from 'date-fns'
import ActivityForm from 'features/ActivityForm/ActivityForm'
import { IActivity } from 'api/interfaces/IActivity'
import { useTranslation } from 'react-i18next'

interface ActivityModalData {
  date: Date
  lastEndTime: Date | undefined
  activity: IActivity | undefined
}

type CalendarModalContext = (data: ActivityModalData) => void

export const CalendarModalContext = React.createContext<CalendarModalContext>(
  undefined!
)

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
      {modalIsOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          header={
            <div id="modal-title">
              <VisuallyHidden id="modal-title">
                {activityData.activity
                  ? t('accessibility.edit_activity') + ':'
                  : t('accessibility.new_activity') + ':'}
                {DateTime.format(activityData.date, 'dd MMMM')}
              </VisuallyHidden>
              <b style={{ fontSize: 18 }}>{getDate(activityData.date)}</b>
              {DateTime.format(activityData.date, ' MMMM')}
            </div>
          }
        >
          <ActivityForm
            date={activityData.date}
            lastEndTime={activityData.lastEndTime}
            activity={activityData.activity}
            onAfterSubmit={() => setIsOpen(false)}
          />
        </Modal>
      )}
    </CalendarModalContext.Provider>
  )
}

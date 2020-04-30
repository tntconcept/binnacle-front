import React, {useEffect, useRef, useState} from 'react'
import Modal from "core/components/Modal"
import VisuallyHidden from "core/components/VisuallyHidden"
import DateTime from "services/DateTime"
import {getDate} from "date-fns"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {IActivity} from "api/interfaces/IActivity"


interface ActivityModalData {
  date: Date
  lastEndTime: Date | undefined
  activity: IActivity | undefined
}

type CalendarModalContext = (data: ActivityModalData) => void

export const CalendarModalContext = React.createContext<CalendarModalContext>(undefined!)

export const CalendarModal: React.FC = (props) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const [activityData, setActivityData] = useState<ActivityModalData>({
    date: new Date(),
    lastEndTime: undefined,
    activity: undefined
  });

  // const updateActivity = (activityData: ActivityData) => {
  //   setActivityData(activityData);
  //
  //   // Actualizo el current Ref para, en teoria si navego por teclado ya estaría actualizado.
  //   // activeRef.current = state.activities.findIndex(day =>  isSameDay(day.date, activityData.date)) + 1
  // };

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
            <div id='modal-title'>
              <VisuallyHidden id='modal-title'>
                {activityData.activity ? 'Edit activity:' : "Create activity:"}
                {DateTime.format(activityData.date, 'dd MMMM')}
              </VisuallyHidden>
              <b style={{fontSize: 18}}>
                {getDate(activityData.date)}
              </b>
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
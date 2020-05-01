import React, {useContext} from "react"
import {addMinutes, isSameMonth} from "date-fns"
import {cls} from "utils/helpers"
import styles from "pages/binnacle/desktop/CalendarCell/CalendarCell.module.css"
import CellHeader from "pages/binnacle/desktop/CalendarCell/CellHeader"
import CellBody from "pages/binnacle/desktop/CalendarCell/CellBody"
import {IActivity, IActivityDay} from "api/interfaces/IActivity"
import ActivityButton from "pages/binnacle/desktop/ActivityButton"
import {CalendarModalContext} from "pages/binnacle/desktop/CalendarModalContext"
import {useCalendarResources} from "pages/binnacle/desktop/CalendarResourcesContext"

interface ICellContent {
  borderBottom?: boolean
  activityDay: IActivityDay
  isSelected: boolean
  setSelectedCell: (a?: any) => any
  registerRef: (instance: (HTMLButtonElement | null)) => void
}

interface IActivitiesList {
  activities: IActivity[]
  canFocus: boolean
}

const ActivitiesList: React.FC<IActivitiesList> = ({activities, canFocus}) => {
  return (
    <React.Fragment>
      {
        activities.map(activity => (
          <ActivityButton
            key={activity.id}
            activity={activity}
            canFocus={canFocus}
          />
        ))
      }
    </React.Fragment>
  )
}

export const CellContent: React.FC<ICellContent> = props => {
  const { selectedMonth } = useCalendarResources()
  const updateModalData = useContext(CalendarModalContext)

  // Pensar en subirlo a prop
  const isOtherMonth = !isSameMonth(props.activityDay.date, selectedMonth);

  const createActivity = () => {
    updateModalData({
      date: props.activityDay.date,
      lastEndTime: getLastActivityEndTime(props.activityDay),
      activity: undefined
    });
  };

  return (
    <div
      className={cls(
        styles.container,
        isOtherMonth && styles.isOtherMonth,
        props.borderBottom && styles.containerDivider
      )}
      onClick={createActivity}
    >
      <CellHeader
        date={props.activityDay.date}
        time={props.activityDay.workedMinutes}
        ref={props.registerRef}
      />
      <CellBody
        isSelected={props.isSelected}
        onEscKey={props.setSelectedCell}
      >
        <ActivitiesList
          activities={props.activityDay.activities}
          canFocus={props.isSelected}
        />
      </CellBody>
    </div>
  );
};


const getLastActivityEndTime = (activityDay: IActivityDay) => {
  if (activityDay.activities.length > 0) {
    const lastImputedActivity =
      activityDay.activities[activityDay.activities.length - 1];
    return addMinutes(
      lastImputedActivity.startDate,
      lastImputedActivity.duration
    );
  }

  return undefined;
};
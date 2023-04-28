import type { FC } from 'react'
import { Fragment } from 'react'
import { Activity } from '../../../domain/activity'
import ActivityCard from './activity-card'

type ActivitiesListProps = {
  activities: Activity[]
  onClick(activity: Activity): void
}

export const ActivitiesList: FC<ActivitiesListProps> = (props) => {
  // const navigate = useNavigate()
  //
  // const updateActivityForm = useAction(OpenUpdateActivityFormAction)
  // const handleOpenUpdateActivityForm = (activity: Activity) => {
  //   updateActivityForm(activity)
  //   navigate(paths.activity)
  // }

  return (
    <Fragment>
      {props.activities.map((activity) => (
        <div key={activity.id} onClick={() => props.onClick(activity)}>
          <ActivityCard activity={activity} />
        </div>
      ))}
    </Fragment>
  )
}

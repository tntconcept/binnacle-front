import type { FC } from 'react'
import { Fragment } from 'react'
import { Activity } from '../../../domain/activity'
import { ActivityCard } from './activity-card'

type ActivitiesListProps = {
  activities: Activity[]
  onClick(activity: Activity): void
}

export const ActivitiesList: FC<ActivitiesListProps> = (props) => {
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

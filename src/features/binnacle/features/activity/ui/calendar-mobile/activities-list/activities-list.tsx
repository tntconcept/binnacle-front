import { observer } from 'mobx-react'
import type { FC } from 'react'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAction } from 'shared/arch/hooks/use-action'
import { paths } from 'shared/router/paths'
import { Activity } from '../../../domain/activity'
import ActivityCard from './activity-card'

interface IActivitiesList {
  activities: Activity[]
}

export const ActivitiesList: FC<IActivitiesList> = observer((props) => {
  const navigate = useNavigate()

  const updateActivityForm = useAction(OpenUpdateActivityFormAction)
  const handleOpenUpdateActivityForm = (activity: Activity) => {
    updateActivityForm(activity)
    navigate(paths.activity)
  }

  return (
    <Fragment>
      {props.activities.map((activity) => (
        <div key={activity.id} onClick={() => handleOpenUpdateActivityForm(activity)}>
          <ActivityCard activity={activity} />
        </div>
      ))}
    </Fragment>
  )
})

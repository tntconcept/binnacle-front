import { observer } from 'mobx-react'
import { OpenUpdateActivityFormAction } from 'modules/binnacle/data-access/actions/open-update-activity-form-action'
import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import ActivityCard from 'modules/binnacle/page/BinnacleMobile/BinnacleScreen/ActivitiesList/ActivityCard'
import type { FC } from 'react'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAction } from 'shared/arch/hooks/use-action'
import { paths } from 'shared/router/paths'

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

import React from "react"
import {IActivity} from "interfaces/IActivity"
import ActivityCard from "core/components/ActivityCard"
import {Link} from "react-router-dom"

interface IActivitiesList {
  activities: IActivity[];
}

export const ActivitiesList: React.FC<IActivitiesList> = props => {
  return (
    <React.Fragment>
      {props.activities.map(activity => (
        <Link
          key={activity.id}
          to={{
            pathname: "/binnacle/activity",
            state: {
              date: activity.startDate,
              activity: activity
            }
          }}
          style={{
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <ActivityCard activity={activity} />
        </Link>
      ))}
    </React.Fragment>
  );
};

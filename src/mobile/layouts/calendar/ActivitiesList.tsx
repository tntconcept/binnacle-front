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
          to={{
            pathname: "/binnacle/activity",
            state: activity
          }}
          style={{
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <ActivityCard key={activity.id} activity={activity} />
        </Link>
      ))}
    </React.Fragment>
  );
};

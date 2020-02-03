import React from "react"
import {IActivity} from "interfaces/IActivity"
import ActivityCard from "core/components/ActivityCard"

interface IActivitiesList {
  activities: IActivity[];
}

export const ActivitiesList: React.FC<IActivitiesList> = props => {
  console.count("ActivitiesListRendered");

  return (
    <React.Fragment>
      {props.activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </React.Fragment>
  );
};

import React from "react"
import {IActivity} from "interfaces/IActivity"
import ActivityCard from "core/components/ActivityCard"
import {Link} from "react-router-dom"
import {css} from "linaria"

interface IActivitiesList {
  activities: IActivity[];
}

const link = css`
  text-decoration: none;
  color: inherit;
`;

export const ActivitiesList: React.FC<IActivitiesList> = props => {
  console.count("ActivitiesListRendered");

  return (
    <React.Fragment>
      {props.activities.map(activity => (
        <Link
          to={{
            pathname: "/activity",
            state: activity
          }}
          className={link}
        >
          <ActivityCard key={activity.id} activity={activity} />
        </Link>
      ))}
    </React.Fragment>
  );
};

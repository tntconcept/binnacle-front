import React from "react"
import {calculateTime} from "desktop/layouts/calendar/utils"
import style from "./activity.module.css"
import {IActivity} from "interfaces/IActivity"

interface ActivityProps {
  activity: IActivity;
}

const Activity: React.FC<ActivityProps> = ({ activity }) => {
  return (
    <button
      key={activity.id}
      className={activity.billable ? style.billable : style.normal}
    >
      <span className={style.text}>
        <b>{calculateTime(activity.startDate, activity.duration)}</b>{" "}
        {activity.project.name}
      </span>
    </button>
  );
};

export default Activity;

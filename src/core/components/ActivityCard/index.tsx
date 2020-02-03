import React from "react"
import {ReactComponent as Clock} from "assets/icons/clock.svg"
import {ReactComponent as Users} from "assets/icons/users.svg"
import {IActivity} from "interfaces/IActivity"
import {
  base,
  billable,
  description,
  dot,
  headerBlock,
  headerBlockWithMarginBottom,
  icon,
  isBillable,
  line,
  organization,
  projectAndRoleText
} from "core/components/ActivityCard/ActivityCard.styles"
import {cx} from "linaria"

interface IProps {
  activity: IActivity;
}

const ActivityCard: React.FC<IProps> = ({ activity }) => {
  return (
    <div className={cx(base, activity.billable && isBillable)}>
      {activity.billable && <span className={billable}>facturable</span>}
      <div>
        <span className={organization}>{activity.organization.name}</span>
        <div className={headerBlockWithMarginBottom}>
          <Users className={icon} />
          <p className={projectAndRoleText}>{activity.project.name}</p>
          <span className={dot}>.</span>
          <p className={projectAndRoleText}>{activity.projectRole.name}</p>
        </div>
        <div className={headerBlock}>
          <Clock className={icon} />
          <span>10:30 - 12:30 (2h 30m)</span>
        </div>
      </div>
      <div className={line} />
      <p className={description}>{activity.description}</p>
    </div>
  );
};

export default ActivityCard;

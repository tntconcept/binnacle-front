import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {Link, useLocation} from "react-router-dom"
import {IActivity} from "interfaces/IActivity"
import {ReactComponent as ArrowLeft} from "assets/icons/chevron-left.svg"
import {css} from "linaria"
import {format} from "date-fns"
import {es} from "date-fns/locale"

const backLink = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 5px 10px;
  text-decoration: none;
  color: black;
`;

const baseNav = css`
  height: 50px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 16px;
`;

const formatActivityDate = (activity: IActivity | undefined) => {
  if (activity) {
    return format(activity.startDate, "dd 'de' MMMM", { locale: es });
  }

  return format(new Date(), "dd 'de' MMMM", { locale: es });
};

const ActivityPage = () => {
  const location = useLocation();

  return (
    <div>
      <nav className={baseNav}>
        <Link to="/binnacle" className={backLink}>
          <ArrowLeft />
          Back
        </Link>
        <span>{formatActivityDate(location.state as IActivity)}</span>
      </nav>
      <ActivityForm
        activity={location.state as IActivity | undefined}
        initialSelectedRole={undefined}
        initialStartTime={undefined}
      />
    </div>
  );
};

export default ActivityPage;
